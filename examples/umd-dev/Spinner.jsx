const Spinner = () => (
  <div
    style={{
      display: 'block',
      position: 'fixed',
      right: 15,
      top: 15,
      zIndex: 1031
    }}
  >
    <div
      style={{
        animation: 'spinner 400ms linear infinite',
        borderBottom: '2px solid transparent',
        borderLeft: '2px solid #29d',
        borderRadius: '50%',
        borderRight: '2px solid transparent',
        borderTop: '2px solid #29d',
        boxSizing: 'border-box',
        height: 18,
        width: 18
      }}
    />
  </div>
)

window.Spinner = Spinner
