const baseStyle = {
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: '16px',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const styles = {
  success: {
    color: '#0f5132',
    backgroundColor: '#d1e7dd',
    border: '1px solid #badbcc',
  },
  error: {
    color: '#842029',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c2c7',
  },
}

const Alert = ({ type, message }) => {
  if (!message) return null
  const variant = styles[type] || styles.error

  return (
    <div style={{ ...baseStyle, ...variant }}>
      <span>{message}</span>
    </div>
  )
}

export default Alert
