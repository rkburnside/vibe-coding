const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020205, 0.12); // Heavy fog

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Stars background
const starGeo = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({color: 0xffffff, size: 0.1});
const starVertices = [];
for(let i=0; i<1000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = Math.random() * 100;
    const z = (Math.random() - 0.5) * 200;
    starVertices.push(x, y, z);
}
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeo, starMaterial);
scene.add(stars);

// Grid Floor
const gridHelper = new THREE.GridHelper(100, 50, 0x00ffff, 0x005555);
gridHelper.position.y = 0;
scene.add(gridHelper);

// Solid floor to hide clipping
const solidFloorGeo = new THREE.PlaneGeometry(100, 100);
const solidFloorMat = new THREE.MeshBasicMaterial({ color: 0x020205 });
const solidFloor = new THREE.Mesh(solidFloorGeo, solidFloorMat);
solidFloor.rotation.x = -Math.PI / 2;
solidFloor.position.y = -0.1;
scene.add(solidFloor);

// Outer Walls (Black fill, neon edge)
const wallGeo = new THREE.BoxGeometry(100, 15, 2);
const wallMat = new THREE.MeshBasicMaterial({ color: 0x050005 });
const wallEdges = new THREE.EdgesGeometry(wallGeo);
const wallLineMat = new THREE.LineBasicMaterial({ color: 0xff00ff });

function createWall(x, y, z, rotY) {
    const wall = new THREE.Mesh(wallGeo, wallMat);
    const edges = new THREE.LineSegments(wallEdges, wallLineMat);
    wall.add(edges);
    wall.position.set(x, y, z);
    wall.rotation.y = rotY;
    scene.add(wall);
    return wall;
}

const walls = []; // logical bounds check
walls.push(createWall(0, 7.5, -50, 0));
walls.push(createWall(0, 7.5, 50, 0));
walls.push(createWall(-50, 7.5, 0, Math.PI/2));
walls.push(createWall(50, 7.5, 0, Math.PI/2));

// Obstacles (Neon pillars)
const obstacles = [];
const obsGeo = new THREE.BoxGeometry(4, 15, 4);
const obsMat = new THREE.MeshBasicMaterial({ color: 0x011101 });
const obsEdges = new THREE.EdgesGeometry(obsGeo);
const obsLineMat = new THREE.LineBasicMaterial({ color: 0x00ff00 });

for(let i=0; i<8; i++) {
    // Prevent spawning in center
    let ox, oz;
    do {
        ox = Math.random()*80 - 40;
        oz = Math.random()*80 - 40;
    } while(Math.abs(ox) < 15 && Math.abs(oz) < 15);

    const obs = new THREE.Mesh(obsGeo, obsMat);
    const edges = new THREE.LineSegments(obsEdges, obsLineMat);
    obs.add(edges);
    obs.position.set(ox, 7.5, oz);
    scene.add(obs);
    obstacles.push(obs);
}

// Player
camera.position.set(0, 2, 0);
const player = {
    speed: 0.25,
    turnSpeed: 0.04,
    health: 100,
    radius: 1.5,
    canShoot: true,
    score: 0
};

// Input
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, Shift: false, ' ': false, r: false, R: false };
window.addEventListener('keydown', (e) => { 
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true; 
    // Handle Space default scrolling prevent
    if(e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
    }
    if ((e.key === 'r' || e.key === 'R') && player.health <= 0) resetGame();
}, { passive: false });
window.addEventListener('keyup', (e) => { if (keys.hasOwnProperty(e.key)) keys[e.key] = false; });

// Projectiles
const projectiles = [];
const laserGeo = new THREE.BoxGeometry(0.1, 0.1, 2);
const playerLaserMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const enemyLaserMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

function shoot(isPlayer, origin, rotation) {
    const mesh = new THREE.Mesh(laserGeo, isPlayer ? playerLaserMat : enemyLaserMat);
    mesh.position.copy(origin);
    mesh.rotation.copy(rotation);
    
    // Spawn ahead so we don't shoot ourselves
    const dir = new THREE.Vector3(0, 0, -1).applyEuler(rotation).normalize();
    mesh.position.addScaledVector(dir, 2.5);
    if (!isPlayer) mesh.position.y += 0.5; // Shoot from her glowing core
    else mesh.position.y -= 0.2; // Player shoots slightly below eye level
    
    scene.add(mesh);
    projectiles.push({
        mesh,
        isPlayer,
        velocity: dir.multiplyScalar(1.2),
        life: 80
    });
}

// Enemy (Cyber-Woman)
const enemyGroup = new THREE.Group();
const enemyMat = new THREE.MeshBasicMaterial({ color: 0x220022 });
const enemyLineMat = new THREE.LineBasicMaterial({ color: 0xff00ff });

// Head
const headGeo = new THREE.SphereGeometry(0.6, 8, 8);
const head = new THREE.Mesh(headGeo, enemyMat);
head.add(new THREE.LineSegments(new THREE.EdgesGeometry(headGeo), enemyLineMat));
head.position.y = 1.5;
enemyGroup.add(head);

// Visor / Hair
const visorGeo = new THREE.TorusGeometry(0.62, 0.15, 4, 12, Math.PI);
const visor = new THREE.Mesh(visorGeo, new THREE.MeshBasicMaterial({ color: 0xff0055 }));
visor.rotation.x = -Math.PI / 8;
visor.position.y = 1.6;
visor.position.z = 0.1;
enemyGroup.add(visor);

// Torso (Dress shape)
const torsoGeo = new THREE.ConeGeometry(1.2, 2.8, 8);
const torso = new THREE.Mesh(torsoGeo, enemyMat);
torso.add(new THREE.LineSegments(new THREE.EdgesGeometry(torsoGeo), enemyLineMat));
torso.position.y = -0.3;
enemyGroup.add(torso);

// Core (Glowing chest emitter)
const coreGeo = new THREE.OctahedronGeometry(0.4, 0);
const coreMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const core = new THREE.Mesh(coreGeo, coreMat);
core.position.set(0, 0.5, 0.9);
enemyGroup.add(core);

enemyGroup.position.set(0, 4, -30);
scene.add(enemyGroup);

const enemyState = {
    health: 50,
    speed: 0.12,
    active: true,
    shootCooldown: 0,
    hoverAngle: 0,
    radius: 2
};

function resetGame() {
    player.health = 100;
    player.score = 0;
    camera.position.set(0, 2, 0);
    camera.rotation.set(0, 0, 0);
    
    document.getElementById('health').innerText = `HEALTH: ${player.health}`;
    document.getElementById('health').style.color = '#0f0';
    document.getElementById('health').style.textShadow = '0 0 15px #0f0';
    document.getElementById('score').innerText = `SCORE: ${player.score}`;
    document.getElementById('game-over').style.display = 'none';
    
    enemyGroup.position.set(20, 4, -30);
    enemyState.health = 50;
    enemyState.active = true;
    enemyState.speed = 0.12;
    if(!scene.getObjectById(enemyGroup.id)) scene.add(enemyGroup);

    projectiles.forEach(p => scene.remove(p.mesh));
    projectiles.length = 0;
}

function checkCollision(pos, radius) {
    // Walls
    if (pos.x < -48 + radius || pos.x > 48 - radius || 
        pos.z < -48 + radius || pos.z > 48 - radius) return true;
    
    // Obstacles
    for (let obs of obstacles) {
        if (Math.abs(pos.x - obs.position.x) < (2 + radius) &&
            Math.abs(pos.z - obs.position.z) < (2 + radius)) {
            return true;
        }
    }
    return false;
}

// Window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    if (player.health > 0) {
        // Player Move
        const dir = new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation);
        const sideDir = new THREE.Vector3(-1, 0, 0).applyEuler(camera.rotation);
        
        let moveX = 0;
        let moveZ = 0;

        if (keys.Shift) {
            // Strafe
            if (keys.ArrowLeft) {
                moveX += sideDir.x * player.speed;
                moveZ += sideDir.z * player.speed;
            }
            if (keys.ArrowRight) {
                moveX -= sideDir.x * player.speed;
                moveZ -= sideDir.z * player.speed;
            }
        } else {
            // Turn
            if (keys.ArrowLeft) camera.rotation.y += player.turnSpeed;
            if (keys.ArrowRight) camera.rotation.y -= player.turnSpeed;
        }

        if (keys.ArrowUp) {
            moveX += dir.x * player.speed;
            moveZ += dir.z * player.speed;
        }
        if (keys.ArrowDown) {
            moveX -= dir.x * player.speed;
            moveZ -= dir.z * player.speed;
        }

        // Apply movement with simple sliding collision
        let nextPos = camera.position.clone();
        nextPos.x += moveX;
        if (!checkCollision(nextPos, player.radius)) {
            camera.position.x = nextPos.x;
        }
        
        nextPos = camera.position.clone();
        nextPos.z += moveZ;
        if (!checkCollision(nextPos, player.radius)) {
            camera.position.z = nextPos.z;
        }

        // Shoot
        if (keys[' '] && player.canShoot) {
            shoot(true, camera.position, camera.rotation);
            player.canShoot = false;
            setTimeout(() => player.canShoot = true, 300); // 300ms fire rate
        }

        // Enemy Logic
        if (enemyState.active) {
            enemyGroup.lookAt(camera.position.x, enemyGroup.position.y, camera.position.z);
            
            // Animation
            enemyState.hoverAngle += 0.05;
            enemyGroup.position.y = 4 + Math.sin(enemyState.hoverAngle) * 0.5;
            // Ensure she stays upright facing player
            
            const dist = enemyGroup.position.distanceTo(camera.position);

            // Move
            if (dist > 15) {
                const eDir = new THREE.Vector3().subVectors(camera.position, enemyGroup.position).normalize();
                let eNextPos = enemyGroup.position.clone();
                eNextPos.x += eDir.x * enemyState.speed;
                eNextPos.z += eDir.z * enemyState.speed;
                if (!checkCollision(eNextPos, enemyState.radius)) {
                    enemyGroup.position.x = eNextPos.x;
                    enemyGroup.position.z = eNextPos.z;
                }
            } else if (dist < 10) {
                // Back away if too close
                const eDir = new THREE.Vector3().subVectors(enemyGroup.position, camera.position).normalize();
                let eNextPos = enemyGroup.position.clone();
                eNextPos.x += eDir.x * enemyState.speed;
                eNextPos.z += eDir.z * enemyState.speed;
                if (!checkCollision(eNextPos, enemyState.radius)) {
                    enemyGroup.position.x = eNextPos.x;
                    enemyGroup.position.z = eNextPos.z;
                }
            }

            // Enemy Shoot logic
            enemyState.shootCooldown--;
            if (enemyState.shootCooldown <= 0 && dist < 25) { // increased scope slightly so she shoots aggressively out of fog
                const eRot = enemyGroup.rotation.clone();
                // Add some inaccuracy
                eRot.y += (Math.random() - 0.5) * 0.2;
                // Double tap attack
                shoot(false, enemyGroup.position, eRot);
                setTimeout(() => {
                    if(enemyState.active) shoot(false, enemyGroup.position, eRot);
                }, 150);
                enemyState.shootCooldown = 30 + Math.random() * 30; // Random interval, faster
            }
        }
    }

    // Projectile Updates
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.mesh.position.add(p.velocity);
        p.life--;

        let remove = false;

        if (checkCollision(p.mesh.position, 0.2)) {
            remove = true;
        }

        // Hit Enemy
        if (!remove && p.isPlayer && enemyState.active) {
            if (p.mesh.position.distanceTo(enemyGroup.position) < enemyState.radius + 1.0) {
                remove = true;
                enemyState.health -= 25;
                
                // Damage flash
                core.material.color.setHex(0xffffff);
                enemyLineMat.color.setHex(0xffffff);
                setTimeout(() => { 
                    if(enemyState.active) {
                        core.material.color.setHex(0xff0000);
                        enemyLineMat.color.setHex(0xff0000);
                    }
                }, 100);

                if (enemyState.health <= 0) {
                    enemyState.active = false;
                    scene.remove(enemyGroup);
                    player.score += 100;
                    document.getElementById('score').innerText = `SCORE: ${player.score}`;
                    
                    // Respawn stronger
                    setTimeout(() => {
                        if(player.health > 0) {
                            enemyState.active = true;
                            // Incremental difficulty
                            enemyState.health = 50 + (player.score / 100) * 15;
                            enemyState.speed = Math.min(0.25, 0.12 + (player.score / 1000));
                            core.material.color.setHex(0xff0000);
                            enemyLineMat.color.setHex(0xff0000);
                            
                            // Spawn at random location not too close to player
                            let nx, nz;
                            do {
                                nx = Math.random()*80 - 40;
                                nz = Math.random()*80 - 40;
                            } while(Math.hypot(nx - camera.position.x, nz - camera.position.z) < 30);
                            
                            enemyGroup.position.set(nx, 4, nz);
                            scene.add(enemyGroup);
                        }
                    }, 3000);
                }
            }
        }

        // Hit Player
        if (!remove && !p.isPlayer && player.health > 0) {
            if (p.mesh.position.distanceTo(camera.position) < player.radius + 1.0) {
                remove = true;
                player.health -= 10;
                
                const hpEl = document.getElementById('health');
                hpEl.innerText = `HEALTH: ${player.health}`;
                
                // Overlay flash
                const overlay = document.getElementById('damage-overlay');
                overlay.style.opacity = '1';
                setTimeout(() => { overlay.style.opacity = '0'; }, 150);

                if (player.health <= 30) {
                    hpEl.style.color = '#f00';
                    hpEl.style.textShadow = '0 0 15px #f00';
                }

                if (player.health <= 0) {
                    document.getElementById('final-score').innerText = `SCORE: ${player.score}`;
                    document.getElementById('game-over').style.display = 'block';
                }
            }
        }

        if (p.life <= 0 || remove) {
            scene.remove(p.mesh);
            projectiles.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
}

animate();
