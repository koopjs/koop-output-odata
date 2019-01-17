/**
 * Handle a request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
function requestHandler (req, res) {
  res.status(200).json({ message: 'success' })
}

module.exports = requestHandler
