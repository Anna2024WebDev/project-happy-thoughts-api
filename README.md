# Project Happy Thoughts API

This week I created the backend for my Happy Thoughts twitter like app. https://happythoughtsbyanna.netlify.app/
The backend has been created with node and express and the thoughts and likes are stored using MongoDB.

## The problem

I started out by creating a Mongoose schema to define the structure of the thoughts collection in the database. I defined GET routes for listing all available endpoints and fetching all thoughts, and POST routes for creating new thoughts and liking a specific thought. My biggest challenges was the debugging issues, Identifying why some actions (e.g., liking a thought or fetching data) didn’t work as expected and resolving them step by step.

## View it live

https://project-happy-thoughts-api-42bh.onrender.com
