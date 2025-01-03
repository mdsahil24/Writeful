import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function register(ev) {
    ev.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success messages

    // Check for password match
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.status === 201) {
        setSuccessMessage('Registration successful! You can now log in.');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Join Narrative</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(ev) => setConfirmPassword(ev.target.value)}
      />
      {errorMessage && <p style={{ color: 'red', fontSize: '14px' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', fontSize: '14px' }}>{successMessage}</p>}
      <button>Register</button>

      <div className="new-to-site">
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </form>
  );
}
