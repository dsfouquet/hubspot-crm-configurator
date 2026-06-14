import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// NOTE: StrictMode intentionally omitted. Its double-invoke in dev detaches
// ReactFlow's (v11) node ResizeObserver, leaving the automation diagrams with
// nodes but no edges. Removing it makes the workflow flowcharts render their
// connectors in the dev/demo environment, matching production.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
