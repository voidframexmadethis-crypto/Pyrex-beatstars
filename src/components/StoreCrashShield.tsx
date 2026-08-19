import React from 'react';

export class StoreCrashShield extends React.Component<any, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Store error caught safely:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', background: '#0a0a0c', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', margin: '20px' }}>
          <p style={{ marginBottom: '12px', fontSize: '15px', fontWeight: 500 }}>Audio component refreshing... your beats are safe!</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '8px 16px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Reload Player
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
