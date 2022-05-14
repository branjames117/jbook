import './preview.css';
import { useEffect, useRef } from 'react';

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

const html = `
    <html>
      <head>
        <style>html { background-color: white }</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            document.getElementById('root').innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              console.error(err);
          }

          /* error listener to handle asynchronous errors */
          window.addEventListener('error', (event) => {
            /* prevent default behavior of error event since we are handling it ourselves in handleError callback */
            event.preventDefault();
            handleError(event.error);
          });

          /* message listener for receiving messages from outside of the iframe */
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false)
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // reset html in iframe whenever we get new code
    iframe.current.srcdoc = html;
    // setCode(result.outputFiles[0].text);
    const timer = setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframe}
        title='preview'
        sandbox='allow-scripts'
        srcDoc={html}
      />
      {bundlingStatus && <div className='preview-error'>{bundlingStatus}</div>}
    </div>
  );
};

export default Preview;
