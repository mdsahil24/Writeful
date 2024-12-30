export default function handler(req, res) {
    const users = ['Alice', 'Bob', 'Charlie'];
    res.status(200).json(users);
  }
  