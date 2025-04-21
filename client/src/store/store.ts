import {configureStore} from '@reduxjs/toolkit'
import orderSlice from './Slice/orderSlice'

const store = configureStore({
    reducer: {
        order: orderSlice
    }
})

export default store