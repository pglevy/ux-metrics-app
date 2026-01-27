// API client for calling skills through the backend
// This file demonstrates the pattern for integrating the UI with your skills backend

// Define types for your domain entities
// These should match the schema defined in your backend (src/schema/types.ts)
export type Entity = {
  id: string;
  // Add your entity fields here
  createdAt: string;
  updatedAt: string;
  skill_data: Record<string, any>;  // Flexible overflow for skill outputs
}

// Base API URL - proxied through Vite to avoid CORS issues
const API = '/api';

/**
 * Example: Get all entities
 * Pattern: GET request to fetch a list
 */
export async function getEntities(): Promise<Entity[]> {
  const res = await fetch(`${API}/entities`);
  if (!res.ok) throw new Error('Failed to fetch entities');
  return res.json();
}

/**
 * Example: Get a single entity by ID
 * Pattern: GET request with path parameter
 */
export async function getEntity(id: string): Promise<Entity> {
  const res = await fetch(`${API}/entities/${id}`);
  if (!res.ok) throw new Error('Failed to fetch entity');
  return res.json();
}

/**
 * Example: Create a new entity (calls a skill)
 * Pattern: POST request that invokes a skill on the backend
 *
 * The backend route would:
 * 1. Receive this data
 * 2. Execute the appropriate skill
 * 3. Store the skill output
 * 4. Return the created entity
 */
export async function createEntity(data: {
  // Define input fields your skill needs
  name: string;
  description?: string;
}): Promise<Entity> {
  const res = await fetch(`${API}/entities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create entity');
  return res.json();
}

/**
 * Example: Update an entity (calls a skill)
 * Pattern: PUT/PATCH request for updates
 */
export async function updateEntity(id: string, data: Partial<Entity>): Promise<Entity> {
  const res = await fetch(`${API}/entities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update entity');
  return res.json();
}

/**
 * Example: Perform an action on an entity (calls a skill)
 * Pattern: POST to a sub-resource for actions/skills
 *
 * This is useful when you want to invoke a specific skill on an entity
 * without necessarily updating its fields directly
 */
export async function performAction(id: string, actionData?: any): Promise<Entity> {
  const res = await fetch(`${API}/entities/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(actionData || {})
  });
  if (!res.ok) throw new Error('Failed to perform action');
  return res.json();
}
