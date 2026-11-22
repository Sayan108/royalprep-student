import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type SnackbarState = { message: string; sequence: number; duration: number }
const initialState: SnackbarState = { message: '', sequence: 0, duration: 6000 }

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    show(state, action: PayloadAction<{ message: string; duration: number }>) {
      state.message = action.payload.message
      state.duration = action.payload.duration
      state.sequence += 1
    },
    dismiss(state) { state.message = '' },
  },
})

export const snackbarReducer = snackbar.reducer

export function SnackbarMessage({ message, duration = 6000 }: { message: string; duration?: number }) {
  const dispatch = useDispatch()
  useEffect(() => {
    if (message) dispatch(snackbar.actions.show({ message, duration }))
  }, [dispatch, duration, message])
  return null
}

export function Snackbar() {
  const { message, sequence, duration } = useSelector((state: { snackbar: SnackbarState }) => state.snackbar)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => dispatch(snackbar.actions.dismiss()), duration)
    return () => window.clearTimeout(timer)
  }, [dispatch, duration, message, sequence])
  if (!message) return null
  return <div className="snackbar" role="status">
    <span>{message}</span>
    <button type="button" onClick={() => dispatch(snackbar.actions.dismiss())} aria-label="Dismiss notification">×</button>
  </div>
}
