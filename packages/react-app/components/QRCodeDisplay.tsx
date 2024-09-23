// // components/QRCodeDisplay.tsx
// import QRCode from 'react-qr-code';
// import { Typography } from '@mui/material';

// interface QRCodeDisplayProps {
//   recipient: string;
//   amount: string;
// }

// export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => (
//   <>
//     {recipient && amount && (
//       <div className='text-center mt-4'>
//         <Typography>QR Code</Typography>
//         <QRCode value={JSON.stringify({ recipient, amount })} />
//       </div>
//     )}
//   </>
// );


// components/QRCodeDisplay.tsx
import QRCode from 'react-qr-code';
import { Typography } from '@mui/material';

interface QRCodeDisplayProps {
  recipient: string;
  amount: string;
}


export const QRCodeDisplay = ({ recipient, amount }: QRCodeDisplayProps) => (
  <>
    {recipient && amount && (
      <div className="text-center mt-6 bg-yellow-400 p-4 rounded-xl shadow-md mx-auto">
        <Typography className="text-lg font-semibold text-pink-600 mb-2">QR Code</Typography>
        <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
          <QRCode className="rounded-lg" size={200} value={JSON.stringify({ recipient, amount })} />
        </div>
      </div>    
    )}
  </>
);

