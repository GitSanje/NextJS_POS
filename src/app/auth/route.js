import axios from 'axios'

export async function POST(req) {

    const { username, password } = await req.json();
    const apiURL = process.env.EXPRESS_API_URL || 'http://localhost:5000/api';

    try {
        const response = await axios.post(`${apiURL}/users/login`, { username, password });
        return new Response(JSON.stringify(response.data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.response?.data?.error || 'Login failed' }), { status: error.response?.status || 500 });
    }
}