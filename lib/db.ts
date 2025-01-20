import { sql } from '@vercel/postgres';
import { User, JobPosting, JobApplication } from './types';

export async function createTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS job_postings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        company_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES job_postings(id),
        applicant_id INTEGER REFERENCES users(id),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Tables created successfully");
    return { message: "Tables created successfully" };
  } catch (error) {
    console.error('Error creating tables:', error);
    return { error: "Failed to create tables" };
  }
}

export async function addUser(user: Omit<User, 'id'>) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, password, user_type)
      VALUES (${user.name}, ${user.email}, ${user.password}, ${user.user_type})
      RETURNING id, name, email, user_type;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error adding user:', error);
    return { error: "Failed to add user" };
  }
}

export async function getUsers() {
  try {
    const result = await sql`SELECT id, name, email, user_type FROM users;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { error: "Failed to fetch users" };
  }
}

export async function addJobPosting(jobPosting: Omit<JobPosting, 'id' | 'created_at'>) {
  try {
    const result = await sql`
      INSERT INTO job_postings (title, description, company_id)
      VALUES (${jobPosting.title}, ${jobPosting.description}, ${jobPosting.company_id})
      RETURNING id, title, description, company_id;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error adding job posting:', error);
    return { error: "Failed to add job posting" };
  }
}

export async function getJobPostings() {
  try {
    const result = await sql`
      SELECT jp.*, u.name as company_name 
      FROM job_postings jp 
      JOIN users u ON jp.company_id = u.id;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return { error: "Failed to fetch job postings" };
  }
}

export async function addJobApplication(jobApplication: Omit<JobApplication, 'id' | 'created_at'>) {
  try {
    const result = await sql`
      INSERT INTO job_applications (job_id, applicant_id, status)
      VALUES (${jobApplication.job_id}, ${jobApplication.applicant_id}, ${jobApplication.status})
      RETURNING id, job_id, applicant_id, status;
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error adding job application:', error);
    return { error: "Failed to add job application" };
  }
}

export async function getJobApplications(jobId: number) {
  try {
    const result = await sql`
      SELECT ja.*, u.name as applicant_name 
      FROM job_applications ja 
      JOIN users u ON ja.applicant_id = u.id 
      WHERE ja.job_id = ${jobId};
    `;
    return result.rows;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return { error: "Failed to fetch job applications" };
  }
}

