import { ContractExtractor } from './contractExtractor';
import { pool } from './db';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function processAllContracts() {
  console.log(`[${new Date().toISOString()}] Starting batch contract processing...`);
  
  const extractor = new ContractExtractor();
  
  try {
    // Get all contracts without extracted details
    const query = `
      SELECT c.id, c.file_path, c.user_id, c.title
      FROM contracts c
      LEFT JOIN contract_details cd ON c.id = cd.contract_id
      WHERE cd.id IS NULL
      ORDER BY c.created_at DESC
    `;
    
    const contracts = await pool.query(query);
    console.log(`[${new Date().toISOString()}] Found ${contracts.rows.length} contracts without extracted details`);
    
    for (const contract of contracts.rows) {
      console.log(`[${new Date().toISOString()}] Processing contract ${contract.id}: ${contract.title}`);
      
      // Extract filename from file_path
      const filename = contract.file_path ? contract.file_path.replace('/uploads/', '') : '';
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      
      if (fs.existsSync(filePath)) {
        try {
          console.log(`[${new Date().toISOString()}] Extracting from file: ${filePath}`);
          await extractor.processContract(contract.id, filePath);
          console.log(`[${new Date().toISOString()}] Successfully processed contract ${contract.id}`);
        } catch (error) {
          console.error(`[${new Date().toISOString()}] Error processing contract ${contract.id}:`, error);
        }
      } else {
        console.warn(`[${new Date().toISOString()}] File not found for contract ${contract.id}: ${filePath}`);
      }
    }
    
    console.log(`[${new Date().toISOString()}] Batch processing completed`);
    
    // Verify extraction results
    const verifyQuery = `
      SELECT 
        COUNT(DISTINCT c.id) as total_contracts,
        COUNT(DISTINCT cd.id) as extracted_contracts
      FROM contracts c
      LEFT JOIN contract_details cd ON c.id = cd.contract_id
      WHERE c.user_id = 45
    `;
    
    const result = await pool.query(verifyQuery);
    console.log(`[${new Date().toISOString()}] Extraction results:`, result.rows[0]);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fatal error in batch processing:`, error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
processAllContracts();

export { processAllContracts };