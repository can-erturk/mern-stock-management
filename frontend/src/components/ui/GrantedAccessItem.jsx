import axios from 'axios'
import { toast } from 'react-toastify'

const { VITE_APP_API_URL } = import.meta.env

function GrantedAccessItem({ granted, setGrantedAccess }) {
  const jwt = localStorage.getItem('jwt')

  // Helper function to revoke access
  const handleRevokeAccess = async () => {
    try {
      // Revoke access from the user
      await axios.post(VITE_APP_API_URL + '/share-access/revoke-granted', {
        jwt,
        id: granted.id,
      })

      // Update the granted access state
      setGrantedAccess((prev) => ({
        ...prev,
        granted: prev.granted.filter((g) => g.id !== granted.id),
      }))

      toast.success('Access revoked successfully.')
    } catch (error) {
      console.error(error)
      toast.error('An error occurred. Please try again later.')
    }
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-zinc-200 last-of-type:border-b-0">
      {/* User details */}
      <div>
        <div className="text-sm max-w-[12.5rem] max-sm:max-w-[8rem] overflow-hidden text-ellipsis">
          {granted.username}
        </div>
        <div className="text-lighten/70 text-xs max-w-[12.5rem] max-sm:max-w-[8rem] overflow-hidden text-ellipsis">
          {granted.email}
        </div>
      </div>

      {/* Revoke access button */}
      <button
        className="border border-primary/60 text-primary px-4 py-2 rounded-lg text-xs max-md:px-2.5 max-md:py-1.5"
        onClick={handleRevokeAccess}
      >
        <span>Revoke</span>
        <span className="max-md:hidden"> granted access</span>
      </button>
    </div>
  )
}

export default GrantedAccessItem
