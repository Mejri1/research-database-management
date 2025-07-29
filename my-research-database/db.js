const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',       // Your PostgreSQL username
    host: 'localhost',      // Database host
    database: 'Faculty',    // Your database name
    password: 'omar',       // Your database password
    port: 5432,             // Default PostgreSQL port
});
// Search researcher by ID, Name, or Email
// Search researcher by ID, Name, or Email
const searchResearcher = (query) => {
    return pool.query(
        `SELECT * FROM CHERCHEUR 
         WHERE chno::TEXT ILIKE $1 OR chnom ILIKE $1 OR email ILIKE $1`,
        [`%${query}%`]
    );
};

// Delete researcher by ID
const deleteResearcher = (chno) => {
    return pool.query(`DELETE FROM CHERCHEUR WHERE chno = $1`, [chno]);
};

const getAllChercheurs = async () => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM chercheur');
    client.release();
    return result.rows;
};

// Add your other functions here (getLabHierarchy, getBibliography, getArticlesByResearcher)
const getLabHierarchy = async (labId) => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM lab_hierarchy WHERE lab_id = $1', [labId]);
    client.release();
    return result.rows;
};

async function getPublicationById(pubno) {
    const query = `
        SELECT *
        FROM publication
        WHERE pubno = $1`;
    const values = [pubno];
    const res = await pool.query(query, values);
    return res.rows;
}


async function getArticlesByResearcherId(researcherId) {
    const query = `
        SELECT p.pubno, p.titre, p.theme, p.type, p.volume, p.date, p.apparition, p.editeur
        FROM PUBLICATION p
        JOIN PUBLIER pu ON p.pubno = pu.pubno
        JOIN CHERCHEUR c ON pu.chno = c.chno
        WHERE c.chno = $1`;
    const values = [researcherId];
    const res = await pool.query(query, values);
    return res.rows;
}

async function getResearcherHierarchy(labno) {
    const query = `
        WITH RECURSIVE ResearcherHierarchy AS (
            SELECT chno, chnom, grade, statut, labno, supno, 1 AS level
            FROM CHERCHEUR
            WHERE labno = $1 AND supno IS NULL
            
            UNION ALL
            
            SELECT c.chno, c.chnom, c.grade, c.statut, c.labno, c.supno, rh.level + 1
            FROM CHERCHEUR c
            INNER JOIN ResearcherHierarchy rh ON c.supno = rh.chno
        )
        SELECT * FROM ResearcherHierarchy ORDER BY level, chnom;
    `;
    const result = await pool.query(query, [labno]);
    return result.rows;
}


// Function to add researcher to the database
const addResearcher = (chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno) => {
    return pool.query(
        `INSERT INTO CHERCHEUR (chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [chnom, grade, statut, daterecrut, salaire, prime, email, supno, labno, facno]
    );
};




async function getResearcherHierarchyInLab(labno) {
    try {
        const query = `
            WITH RECURSIVE Hierarchy AS (
    SELECT chno, chnom, grade, statut, supno, 1 AS level
    FROM CHERCHEUR
    WHERE labno = $1 AND supno IS NULL  -- Top-level supervisor has no supervisor (supno IS NULL)
    
    UNION ALL
    

    SELECT c.chno, c.chnom, c.grade, c.statut, c.supno, h.level + 1
    FROM CHERCHEUR c
    JOIN Hierarchy h ON c.supno = h.chno  -- Join to find subordinates
    WHERE c.labno = $1
)

SELECT chno, chnom, grade, statut, supno, level
FROM Hierarchy
ORDER BY level, chno; 
        `;
        const result = await pool.query(query, [labno]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const getBibliographyByResearcherId = async (researcherId) => {
    const query = `
        SELECT p.titre AS publication_title, p.theme, p.type, p.volume, p.date, p.apparition, p.editeur
        FROM PUBLICATION p
        JOIN PUBLIER pu ON p.pubno = pu.pubno
        WHERE pu.chno = $1
        ORDER BY p.date DESC;
    `;
    const values = [researcherId];
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error('Error fetching bibliography:', err);
        throw new Error('Failed to fetch bibliography');
    }
};
const getResearcherHistory= async (chno) => {
    const query = `
        SELECT action_type, action_description, action_date
        FROM researcher_history_log
        WHERE chno = $1
        ORDER BY action_date DESC;  -- Order by the latest action first
    `;
    const values = [chno];
    try {
        const result = await pool.query(query, values);
        return result.rows;  // Return the history log rows
    } catch (err) {
        console.error('Error fetching researcher history log:', err);
        throw new Error('Failed to fetch researcher history log');
    }
};

module.exports = { searchResearcher,deleteResearcher,getAllChercheurs, getLabHierarchy, getPublicationById, getArticlesByResearcherId ,getResearcherHierarchy ,addResearcher,getResearcherHistory,getResearcherHierarchyInLab,getBibliographyByResearcherId};
