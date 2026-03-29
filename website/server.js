const express = require('express');
const path = require('path');
const app = express();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Portfolio data
const portfolioData = {
  name: 'Rich Burnside',
  title: 'Project Manager at L3Harris',
  location: 'Saratoga Springs, Utah, United States',
  email: 'richard.burnside@gmail.com',
  phone: '720-443-3555',
  linkedin: 'richburnside',
  summary: 'Engineer and leader with 15 years experience in all aspects of hardware life-cycle phases including design, requirements definition, proposal efforts, fabrication, assembly, retrofit, refurbish, quality assurance, and decommission of hardware. Designed and implemented solutions for stakeholders and pushed to cut out waste and inefficiencies. Effectively managed projects and worked closely with technicians, assemblers, customers, and contractors.',
  
  skills: [
    'Systems Engineering',
    'Engineering Management',
    'Aerospace',
    'Project Management',
    'EVMS',
    'Jira',
    'Microsoft Project',
    'Requirements Definition',
    'Quality Assurance',
    'Budget Planning',
    'Schedule Management',
    'Risk Mitigation'
  ],
  
  languages: ['Tagalog'],
  
  experience: [
    {
      role: 'Lead Project Manager',
      company: 'L3Harris Technologies',
      location: 'Salt Lake City, Utah, United States',
      duration: 'March 2022 - Present (4 years 1 month)',
      highlights: [
        'Successfully coordinated Operations Test team bidding for Navy programs',
        'Led test development efforts for the P8A depot program',
        'Tracked project progress using EVMS and implemented changes',
        'Secured resources and funding for multiple test development projects',
        'Identified, tracked, and mitigated risks to test development efforts',
        'Managed multiple projects using Jira and Microsoft Project'
      ]
    },
    {
      role: 'Product Engineer',
      company: 'Moog Space and Defense Group',
      location: 'Greater Salt Lake City Area',
      duration: 'October 2018 - March 2022 (3 years 6 months)',
      highlights: [
        'Developed and modified assembly work instructions for >10,000 missile actuation systems',
        'Led product team to create and optimize assembly lines',
        'Identified and implemented design changes on military control actuation systems',
        'Investigated and dispositioned ATP failures',
        'Led product failure investigations and implemented corrective actions'
      ]
    },
    {
      role: 'Staff Systems Engineer and Acting Operations Manager',
      company: 'Lockheed Martin',
      location: 'Vineyard, Utah',
      duration: 'November 2016 - October 2018 (2 years)',
      highlights: [
        'Coordinated technicians, assemblers, and support team members',
        'Successfully integrated new payload assembly lines',
        'Designed and implemented assembly lines for main products',
        'Reduced assembly errors and improved build quality',
        'Located and eliminated production bottleneck',
        'Assisted in sitewide implementation of SAP'
      ]
    },
    {
      role: 'Staff Mechanical Engineer',
      company: 'Lockheed Martin',
      location: 'Littleton, CO',
      duration: '2011 - November 2016 (5 years)',
      highlights: [
        'Led development of Road and Air Transportation System (RATS)',
        'Produced $3-million proposal budget and schedule estimates',
        'Gathered and reviewed requirements from 15+ spacecraft programs',
        'Evaluated and managed 4 simultaneous subcontractors',
        'Reduced future inspection costs by >$20,000',
        'Designed and managed fabrication of legacy shipping frame'
      ]
    }
  ],
  
  education: [
    {
      degree: 'Master of Business Administration (M.B.A.)',
      school: 'San Jose State University',
      years: '2005 - 2008'
    },
    {
      degree: 'Master of Systems Engineering',
      school: 'San Jose State University',
      years: '2005 - 2008'
    },
    {
      degree: 'Bachelor of Science (B.S.), Mechanical Engineering',
      school: 'Brigham Young University',
      years: '2000 - 2003'
    },
    {
      degree: 'Associate of Science (A.S.), Mechanical Engineering',
      school: 'Brigham Young University - Idaho',
      years: '1996 - 2000'
    }
  ],
  
  projects: [
    {
      title: 'Road and Air Transportation System (RATS)',
      company: 'Lockheed Martin',
      description: 'Led development resulting in >$2-million lifetime cost savings',
      achievement: 'Successfully managed multiple spacecraft shipping programs'
    },
    {
      title: 'P8A Depot Program Test Development',
      company: 'L3Harris',
      description: 'Test hardware development, build, and delivery to Navy customer',
      achievement: 'On-time, on-budget delivery'
    },
    {
      title: 'Missile Actuation Systems Assembly Optimization',
      company: 'Moog Space and Defense Group',
      description: 'Directed assembly of >10,000 systems with optimized assembly lines',
      achievement: '36 months of 100% quality and on-time delivery'
    }
  ]
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { data: portfolioData });
});

app.get('/about', (req, res) => {
  res.render('about', { data: portfolioData });
});

app.get('/experience', (req, res) => {
  res.render('experience', { data: portfolioData });
});

app.get('/projects', (req, res) => {
  res.render('projects', { data: portfolioData });
});

app.get('/contact', (req, res) => {
  res.render('contact', { data: portfolioData });
});

app.post('/contact', (req, res) => {
  // In production, you'd send an email here
  res.redirect('/?message=Thank you for your message. I will get back to you soon!');
});

// Start server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Portfolio website running on http://localhost:${PORT}`);
});
