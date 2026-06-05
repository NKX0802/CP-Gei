import { useState } from 'react'
import { QrCode, CheckCircle2, XCircle, Camera, RefreshCw, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

const DEMO_SCANS = [
  { facilityId: 1, facilityName: 'Discussion Room A', result: 'success' },
  { facilityId: 5, facilityName: 'Basketball Court',  result: 'no-booking' },
  { facilityId: 4, facilityName: 'Study Pod 1',       result: 'no-show' },
]

export default function CheckinPage() {
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scannedFacility, setScannedFacility] = useState(null)
  const [demoIdx, setDemoIdx] = useState(0)

  async function simulateScan() {
    setScanning(true)
    setScanResult(null)
    setScannedFacility(null)
    await new Promise(r => setTimeout(r, 2200))

    const demo = DEMO_SCANS[demoIdx % DEMO_SCANS.length]
    setDemoIdx(i => i + 1)
    setScannedFacility(demo.facilityName)
    setScanResult(demo.result)
    setScanning(false)

    if (demo.result === 'success') toast.success('Checked in successfully!')
    else if (demo.result === 'no-booking') toast.error('No valid booking found for this facility.')
    else toast.error('Booking window has expired (no-show).')
  }

  function reset() {
    setScanResult(null)
    setScannedFacility(null)
  }

  return (
    <div className="min-h-screen bg-green-50 pt-16">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Nunito, sans-serif' }}>
            QR Check-In
          </h1>
          <p className="text-sm text-gray-500 mt-1">Scan the QR code at the facility entrance</p>
        </div>

        {/* Scanner UI */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          {!scanning && !scanResult && (
            <>
              {/* Camera frame — simple border */}
              <div className="mx-auto w-52 h-52 mb-5 border-2 border-emerald-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2">
                <QrCode size={40} className="text-gray-300" />
                <p className="text-xs text-gray-300 font-medium">Camera preview</p>
              </div>

              <p className="text-sm text-gray-500 mb-1">Point your camera at the facility QR code</p>
              <p className="text-xs text-gray-400 mb-5">Check in within 15 minutes of your slot start time</p>

              <button
                onClick={simulateScan}
                className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <Camera size={17} /> Simulate Scan (Demo)
              </button>
              <p className="text-[10px] text-gray-300 mt-2">Click 3× to cycle through different outcomes</p>
            </>
          )}

          {scanning && (
            <div className="py-8">
              <div className="mx-auto w-52 h-52 mb-5 border-2 border-emerald-300 rounded-xl bg-gray-50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-[3px] border-emerald-600 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Scanning QR code…</p>
              <p className="text-xs text-gray-400 mt-1">Please hold still</p>
            </div>
          )}

          {scanResult && (
            <div className="py-4">
              {scanResult === 'success' && (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={28} className="text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-bold text-emerald-700 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Checked In!
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">{scannedFacility}</p>
                </>
              )}
              {scanResult === 'no-booking' && (
                <>
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                    <XCircle size={28} className="text-red-500" />
                  </div>
                  <h2 className="text-lg font-bold text-red-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    No Booking Found
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    No active booking for <strong>{scannedFacility}</strong> at this time.
                  </p>
                </>
              )}
              {scanResult === 'no-show' && (
                <>
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                    <Clock size={28} className="text-amber-500" />
                  </div>
                  <h2 className="text-lg font-bold text-amber-600 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    Check-in Window Expired
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">
                    The 15-minute window for <strong>{scannedFacility}</strong> has passed.
                  </p>
                </>
              )}
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 mx-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <RefreshCw size={15} /> Scan Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
