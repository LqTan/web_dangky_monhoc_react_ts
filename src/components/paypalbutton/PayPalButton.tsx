import { useEffect } from 'react'

interface PayPalButtonProps {
  amount: number
  onSuccess: (details: any) => void
}

declare global {
  interface Window {
      paypal?: any;
  }
}

// declare const paypal: any

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  useEffect(() => {
    if (window.paypal) {
      window.paypal.Buttons({
        // Chuyển đổi VND sang USD (tạm tính 1 USD = 23000 VND)
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: (amount / 23000).toFixed(2), // Làm tròn 2 chữ số thập phân
                  currency_code: 'USD'
                }
              }
            ]
          })
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture()
          onSuccess(details)
        },
        onError: (err: any) => {
          console.error('PayPal Error:', err)
        }
      }).render('#paypal-button-container')
    }
  }, [amount, onSuccess])

  return <div id="paypal-button-container"></div>
}

export default PayPalButton