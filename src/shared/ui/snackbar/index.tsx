import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type SnackbarState = { message: string; sequence: number }
const initialState: SnackbarState = { message: '', sequence: 0 }

const snackbar = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    show(state, action: PayloadAction<string>) {
      state.message = action.payload
      state.sequence += 1
    },
    dismiss(state) { state.message = '' },
  },
})

export const snackbarReducer = snackbar.reducer

export function SnackbarMessage({ message }: { message: string }) {
  const dispatch = useDispatch()
  useEffect(() => {
    if (message) dispatch(snackbar.actions.show(message))
  }, [dispatch, message])
  return null
}

export function Snackbar() {
  const { message, sequence } = useSelector((state: { snackbar: SnackbarState }) => state.snackbar)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => dispatch(snackbar.actions.dismiss()), 6000)
    return () => window.clearTimeout(timer)
  }, [dispatch, message, sequence])
  if (!message) return null
  return <div className="snackbar" role="status">
    <span>{message}</span>
    <button type="button" onClick={() => dispatch(snackbar.actions.dismiss())} aria-label="Dismiss notification">×</button>
  </div>
}
