import React from 'react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { render, type RenderOptions } from '@testing-library/react'
import { App as AntApp } from 'antd'
import { baseApi } from '../app/api/baseApi'

const makeStore = () => {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  })
}

type AppStore = ReturnType<typeof makeStore>

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: AppStore
}

export const renderWithProviders = (
  ui: React.ReactElement,
  { store = makeStore(), ...renderOptions }: RenderWithProvidersOptions = {},
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <AntApp>{children}</AntApp>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
