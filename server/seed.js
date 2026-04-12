const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Job = require('./models/Job');
const Bid = require('./models/Bid');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/freelance_marketplace';

const usersData = [
  {
    name: 'Aarav Malhotra',
    email: 'aarav.malhotra@northbridge.io',
    role: 'client',
    bio: 'Founder at Northbridge Labs, hiring product-focused developers for SaaS projects.',
    skills: ['Product Strategy', 'Roadmapping', 'Agile Delivery'],
  },
  {
    name: 'Neha Kulkarni',
    email: 'neha.kulkarni@orbitretail.com',
    role: 'client',
    bio: 'E-commerce operations lead looking for design and frontend support for growth campaigns.',
    skills: ['E-commerce', 'Marketing Ops', 'Analytics'],
  },
  {
    name: 'Rohan Iyer',
    email: 'rohan.iyer@clarityhealth.ai',
    role: 'client',
    bio: 'Building healthcare dashboards and API integrations for internal teams.',
    skills: ['Data Platforms', 'Stakeholder Management', 'Automation'],
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@freelance.dev',
    role: 'freelancer',
    bio: 'Full-stack developer with 6+ years of experience in React, Node.js, and PostgreSQL.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'REST APIs'],
  },
  {
    name: 'Karan Mehta',
    email: 'karan.mehta@indieui.studio',
    role: 'freelancer',
    bio: 'UI engineer specializing in high-performance frontend architecture and accessibility.',
    skills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Accessibility'],
  },
  {
    name: 'Sana Qureshi',
    email: 'sana.qureshi@pixelcraft.design',
    role: 'freelancer',
    bio: 'Product designer focused on conversion-oriented landing pages and design systems.',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Visual Design'],
  },
  {
    name: 'Vikram Deshpande',
    email: 'vikram.deshpande@apiworks.dev',
    role: 'freelancer',
    bio: 'Backend engineer building secure APIs, integrations, and scalable cloud services.',
    skills: ['Express', 'MongoDB', 'AWS', 'CI/CD'],
  },
  {
    name: 'Ananya Sen',
    email: 'ananya.sen@growthops.io',
    role: 'freelancer',
    bio: 'No-code and analytics consultant helping teams automate workflows and reporting.',
    skills: ['Zapier', 'Notion', 'Looker Studio', 'Automation'],
  },
];

const jobsData = [
  {
    title: 'Build a SaaS Billing Dashboard',
    description:
      'Need a responsive dashboard with subscription metrics, invoices list, and customer account views. Backend APIs already exist; frontend implementation and integration are required.',
    budget: 180000,
    deadlines: '2026-05-15',
    status: 'open',
    postedByEmail: 'aarav.malhotra@northbridge.io',
  },
  {
    title: 'Redesign Product Landing Page for Conversion',
    description:
      'Looking for a complete redesign of our marketing landing page with improved information hierarchy, social proof sections, and mobile optimization.',
    budget: 95000,
    deadlines: '2026-05-05',
    status: 'open',
    postedByEmail: 'neha.kulkarni@orbitretail.com',
  },
  {
    title: 'Implement Secure Authentication Flow',
    description:
      'Need JWT-based auth with role-based access control, refresh strategy, and clean middleware structure for an existing Node API project.',
    budget: 140000,
    deadlines: '2026-05-20',
    status: 'in_progress',
    postedByEmail: 'rohan.iyer@clarityhealth.ai',
  },
  {
    title: 'Design System Setup for React App',
    description:
      'Create reusable UI components, style tokens, and documentation examples to standardize frontend development across teams.',
    budget: 120000,
    deadlines: '2026-05-28',
    status: 'open',
    postedByEmail: 'aarav.malhotra@northbridge.io',
  },
  {
    title: 'Automate Weekly Sales Reporting',
    description:
      'Build an automated pipeline that pulls order data, generates KPI summaries, and sends a weekly report email to stakeholders.',
    budget: 70000,
    deadlines: '2026-04-30',
    status: 'open',
    postedByEmail: 'neha.kulkarni@orbitretail.com',
  },
];

const bidsData = [
  {
    jobTitle: 'Build a SaaS Billing Dashboard',
    freelancerEmail: 'priya.sharma@freelance.dev',
    amount: 170000,
    proposal:
      'I can deliver this in 3 milestones: dashboard shell, data integration, and QA pass. I will include reusable chart components and responsive tables.',
    status: 'pending',
  },
  {
    jobTitle: 'Build a SaaS Billing Dashboard',
    freelancerEmail: 'karan.mehta@indieui.studio',
    amount: 165000,
    proposal:
      'I have built similar billing views for B2B SaaS products. I can optimize bundle size and provide accessible, keyboard-friendly interactions.',
    status: 'pending',
  },
  {
    jobTitle: 'Redesign Product Landing Page for Conversion',
    freelancerEmail: 'sana.qureshi@pixelcraft.design',
    amount: 90000,
    proposal:
      'I can provide a full redesign with wireframes, visual design, and handoff specs. I will include conversion-focused section alternatives.',
    status: 'pending',
  },
  {
    jobTitle: 'Redesign Product Landing Page for Conversion',
    freelancerEmail: 'ananya.sen@growthops.io',
    amount: 84000,
    proposal:
      'I can combine UX improvements with analytics instrumentation recommendations so you can validate conversion changes quickly.',
    status: 'pending',
  },
  {
    jobTitle: 'Implement Secure Authentication Flow',
    freelancerEmail: 'vikram.deshpande@apiworks.dev',
    amount: 132500,
    proposal:
      'I can implement secure JWT auth with role guards, refresh token strategy, and endpoint-level authorization checks with tests.',
    status: 'accepted',
    feedback: 'Strong security background and clear implementation plan.',
  },
  {
    jobTitle: 'Implement Secure Authentication Flow',
    freelancerEmail: 'priya.sharma@freelance.dev',
    amount: 138000,
    proposal:
      'Can deliver auth flow with best practices and client-side integration support for profile and protected routes.',
    status: 'rejected',
    feedback: 'Another bid was accepted for this job.',
  },
  {
    jobTitle: 'Design System Setup for React App',
    freelancerEmail: 'karan.mehta@indieui.studio',
    amount: 112000,
    proposal:
      'I can create token-based theming, reusable components, and docs using a practical component catalog approach.',
    status: 'pending',
  },
  {
    jobTitle: 'Automate Weekly Sales Reporting',
    freelancerEmail: 'ananya.sen@growthops.io',
    amount: 64000,
    proposal:
      'I can automate extraction, transformation, and report generation with clear fail alerts and easy handover docs.',
    status: 'pending',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

    await Bid.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});

    const hashedPassword = await bcrypt.hash('Password@123', 10);

    const usersPayload = usersData.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    const users = await User.insertMany(usersPayload);

    const userByEmail = new Map(users.map((user) => [user.email, user]));

    const jobsPayload = jobsData.map((job) => ({
      title: job.title,
      description: job.description,
      budget: job.budget,
      deadlines: job.deadlines,
      status: job.status,
      postedBy: userByEmail.get(job.postedByEmail)._id,
    }));

    const jobs = await Job.insertMany(jobsPayload);

    const jobByTitle = new Map(jobs.map((job) => [job.title, job]));

    const bidsPayload = bidsData.map((bid) => ({
      job: jobByTitle.get(bid.jobTitle)._id,
      freelancer: userByEmail.get(bid.freelancerEmail)._id,
      amount: bid.amount,
      proposal: bid.proposal,
      status: bid.status,
      feedback: bid.feedback,
    }));

    await Bid.insertMany(bidsPayload);

    console.log('Mock data seeded successfully.');
    console.log(`Users: ${users.length}`);
    console.log(`Jobs: ${jobs.length}`);
    console.log(`Bids: ${bidsPayload.length}`);
    console.log('Default password for all users: Password@123');
  } catch (error) {
    console.error('Failed to seed mock data:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();