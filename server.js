const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [
    { id: 1, name: 'Alice (Client)', role: 'client', balance: 1000 },
    { id: 2, name: 'Bob (Freelancer)', role: 'freelancer', balance: 0 },
    { id: 3, name: 'Charlie (Freelancer)', role: 'freelancer', balance: 0 }
];

let jobs = [
    {
        id: 1,
        title: 'Build a Landing Page',
        description: 'Need a responsive landing page for my startup',
        budget: 200,
        postedBy: 1,
        status: 'open',
        hiredFreelancer: null,
        bids: [
            { freelancerId: 2, amount: 180, message: 'I can do this in 3 days!' },
            { freelancerId: 3, amount: 190, message: 'Expert in landing pages.' }
        ]
    },
    {
        id: 2,
        title: 'Logo Design',
        description: 'Modern minimalist logo for tech company',
        budget: 150,
        postedBy: 1,
        status: 'open',
        hiredFreelancer: null,
        bids: []
    }
];

let nextJobId = 3;

app.get('/api/users', (req, res) => {
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`\n Freelance Marketplace running at http://localhost:${PORT}`);
});
