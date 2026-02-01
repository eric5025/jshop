import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentKey, orderId, amount } = body

    // 토스페이먼츠 시크릿 키 (환경 변수에서 가져오기)
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json(
        { error: '결제 서버 설정이 완료되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 토스페이먼츠 결제 확인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId, // orderNumber 사용
        amount,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || '결제 확인에 실패했습니다.' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      payment: data,
    })
  } catch (error: any) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: error.message || '결제 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
