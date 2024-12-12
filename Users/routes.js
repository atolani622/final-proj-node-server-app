import * as dao from './dao.js';

function UserRoutes(app) {

    const signin = async (req, res) => {
        const { username, password } = req.body;
        console.log("Attempting login:", { username, password });
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            console.log(currentUser)
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            console.log("Login failed for user:", username);
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };

    const account = async (req, res) => {
        if (!req.session['currentUser']) {
            return res.status(401).json({ error: 'No user logged in' });
        }
        res.json(req.session['currentUser']);
    };

    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const status = await dao.updateUser(userId, req.body);
        res.json(status);
    };
    const updateCurrentUser = async (req, res) => {
        const { userId } = req.params;
        const status = await dao.updateUser(userId, req.body);
        const currentUser = await dao.findUserById(userId);
        req.session['currentUser'] = currentUser;
        res.json(status);
    };
    const findAllUsers = async (req, res) => {
        const users = await dao.findAllUsers();
        res.json(users);
    };
    const findRecentUserAdded = async (req, res) => {
        const users = await dao.findRecentUserAdded();
        res.json(users);
    };
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: 'Username already taken' });
        } else {
            const currentUser = await dao.createUser(req.body);
            req.session['currentUser'] = currentUser;
            res.json(currentUser);
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.json(200);
    };


    app.post('/api/users', createUser);
    app.get('/api/users', findAllUsers);
    app.get('/api/users/recent', findRecentUserAdded);
    app.get('/api/users/:userId', findUserById);
    app.put('/api/users/:userId', updateUser);
    app.put('/api/users/current/:userId', updateCurrentUser);
    app.delete('/api/users/:userId', deleteUser);
    app.post('/api/users/signup', signup);
    app.post('/api/users/signin', signin);
    app.post('/api/users/signout', signout);
    app.post('/api/users/profile', account);
}
export default UserRoutes;