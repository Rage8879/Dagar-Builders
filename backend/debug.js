exports.loginUser = (req, res) => {
    const { identifier, password } = req.body;
    console.log('Login attempt:', identifier); // Debugging log
    User.findByIdentifier(identifier, async (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            res.status(500).json({ error: 'Failed to login' });
            return;
        }
        if (results.length === 0) {
            console.log('User not found'); // Debugging log
            res.status(400).json({ error: 'Invalid email, mobile, or username' });
            return;
        }
        const user = results[0];
        console.log('User found:', user); // Debugging log
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch); // Debugging log
        if (!isMatch) {
            console.log('Password mismatch'); // Debugging log
            res.status(400).json({ error: 'Invalid email, mobile, or username' });
            return;
        }
        const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
};