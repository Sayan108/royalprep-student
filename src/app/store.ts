import { configureStore } from '@reduxjs/toolkit'
import { snackbarReducer } from '../shared/ui/snackbar'

export const store = configureStore({ reducer: { snackbar: snackbarReducer } })
