export const resultsTableName = 'results'


export const createResultsTable = `CREATE TABLE ${resultsTableName} 
(id INTEGER PRIMARY KEY AUTOINCREMENT,
name STRING,
score INTEGER)
`
export const dropTable = `DROP TABLE ${resultsTableName};`

export const selectAllResults = `SELECT * FROM ${resultsTableName};`


export function insertResults(name, score) {
    return `INSERT INTO ${resultsTableName} (name, score)
    VALUES ("${name}", "${score}");`
}