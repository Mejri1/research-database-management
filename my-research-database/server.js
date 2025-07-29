const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const { searchResearcher, deleteResearcher,getAllChercheurs, getLabHierarchy, getPublicationById, getArticlesByResearcherId ,getResearcherHierarchy,addResearcher,updateResearcher,getResearcherHierarchyInLab,getBibliographyByResearcherId,getResearcherHistory} = require('./db'); // Import your db functions

const app = express();
const port = 5050;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
// Serve the frontend HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Search endpoint
app.get('/search-researcher', async (req, res) => {
    const query = req.query.query;
    try {
        const researchers = await db.searchResearcher(query);
        if (researchers.length === 0) {
            return res.json({ message: 'No researchers found' });
        }
        res.json(researchers);
    } catch (error) {
        console.error('Error searching researchers:', error);
        res.status(500).json({ message: 'Error searching researchers' });
    }
});



// Search researcher route
app.get('/search-researcher', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'Search query is required!' });
    }

    searchResearcher(query)
        .then((result) => {
            if (result.rows.length === 0) {
                return res.json({ message: 'No researcher found!' });
            }
            res.json(result.rows);
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error searching researcher: ' + err.message });
        });
});

// Delete researcher route
app.delete('/delete-researcher/:id', (req, res) => {
    const { id } = req.params;

    deleteResearcher(id)
        .then(() => {
            res.json({ message: 'Researcher deleted successfully!' });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error deleting researcher: ' + err.message });
        });
});
// Other API endpoints...
app.get('/api/chercheurs', async (req, res) => {
    try {
        const chercheurs = await getAllChercheurs();
        res.json(chercheurs); // Send all researchers as JSON
    } catch (error) {
        console.error('Error fetching chercheurs:', error);
        res.status(500).json({ error: 'Failed to fetch chercheurs' });
    }
});
app.get('/api/researcher/articles', async (req, res) => {
    const { researcherId } = req.query; // Get the researcher ID from query parameters
    try {
        const articles = await getArticlesByResearcherId(researcherId);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});
app.get('/api/publication/:pubno', async (req, res) => {
    const { pubno } = req.params; // Get the publication number from the route parameter
    try {
        const publication = await getPublicationById(pubno);
        if (publication.length > 0) {
            res.json(publication[0]); // Return the first matching publication
        } else {
            res.status(404).json({ error: 'Publication not found' });
        }
    } catch (error) {
        console.error('Error fetching publication:', error);
        res.status(500).json({ error: 'Failed to fetch publication' });
    }
});
app.get('/api/hierarchy/:labno', async (req, res) => {
    const labno = req.params.labno;
    try {
        const hierarchy = await getResearcherHierarchy(labno);
        res.json(hierarchy);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to handle form submission and add researcher
app.post('/add-researcher', (req, res) => {
    const { chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno } = req.body;

    // Validate inputs if necessary
    if (!chnom || !grade || !statut || !daterecrut || !salaire || !prime || !email || !labno || !facno) {
        return res.json({ message: 'All fields are required!' });
    }

    // Call the function to add researcher to the database
    addResearcher(chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno)
        .then(result => {
            res.json({ message: 'Researcher added successfully!' });
        })
        .catch(error => {
            res.json({ message: 'Error adding researcher: ' + error.message });
        });
});

// Endpoint to fetch researcher history log
app.get('/api/researcher-history/:chno', async (req, res) => {
    const { chno } = req.params;  // Get the researcher ID (chno) from the route parameter
    try {
        const historyLog = await getResearcherHistory(chno);
        if (historyLog.length > 0) {
            res.json({ history: historyLog });
        } else {
            res.status(404).json({ error: 'No history found for this researcher.' });
        }
    } catch (error) {
        console.error('Error fetching researcher history log:', error);
        res.status(500).json({ error: 'Failed to fetch researcher history log' });
    }
});
app.get('/api/researcher/history', async (req, res) => {
    const { researcherId } = req.query; // Get the researcher ID from query parameters
    try {
        const articles = await getArticlesByResearcherId(researcherId);
        res.json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.put('/api/researcher/:chno', async (req, res) => {
    const { chno } = req.params;
    const updatedData = req.body;

    try {
        const updatedResearcher = await updateResearcher(chno, updatedData);

        if (updatedResearcher) {
            res.json({ message: 'Researcher profile updated successfully!', researcher: updatedResearcher });
        } else {
            res.status(404).json({ error: 'Researcher not found' });
        }
    } catch (error) {
        console.error('Error updating researcher:', error);
        res.status(500).json({ error: 'Failed to update researcher' });
    }
});


app.get('/api/lab/:labno/hierarchy', async (req, res) => {
    const { labno } = req.params;
    try {
        const hierarchy = await getResearcherHierarchyInLab(labno);
        if (hierarchy.length > 0) {
            res.json({ message: 'Hierarchy retrieved successfully', hierarchy });
        } else {
            res.status(404).json({ error: 'No researchers found in this lab' });
        }
    } catch (error) {
        console.error('Error retrieving hierarchy:', error);
        res.status(500).json({ error: 'Failed to retrieve hierarchy' });
    }
});

// Endpoint to fetch bibliography of a researcher
app.get('/api/bibliography/:chno', async (req, res) => {
    const { chno } = req.params; // Get the researcher ID from the route parameter
    try {
        const bibliography = await getBibliographyByResearcherId(chno);
        if (bibliography.length > 0) {
            res.json({ bibliography });
        } else {
            res.status(404).json({ error: 'No publications found for this researcher.' });
        }
    } catch (error) {
        console.error('Error fetching bibliography:', error);
        res.status(500).json({ error: 'Failed to fetch bibliography' });
    }
});
app.get('/search-researcher', async (req, res) => {
    const query = req.query.query;
    // Implement search logic in db.js and call it here
    const results = await db.searchResearchers(query);
    res.json(results);
});
app.put('/update-researcher/:chno', async (req, res) => {
    const chno = req.params.chno;
    const updatedData = req.body;
    const result = await db.updateResearcher(chno, updatedData);
    res.json({ message: result ? 'Researcher updated successfully!' : 'Failed to update researcher.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
