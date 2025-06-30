// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  // e.g. "http://123.45.67.89:4000"
  timeout: 5000,
});
