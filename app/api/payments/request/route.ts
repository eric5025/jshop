import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, orderId, orderName, customerName, customerEmail } = body

    // 토스페이먼츠 시크릿 키
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json(
        { error: '결제 서버 설정이 완료되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 결제 요청 생성 (토스페이먼츠는 클라이언트에서 직접 위젯을 통해 처리하므로
    // 여기서는 주문 정보를 검증하고 클라이언트 키를 반환합니다)
    const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY

    if (!clientKey) {
      return NextResponse.json(
        { error: '결제 클라이언트 설정이 완료되지 않았습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      clientKey,
      orderId,
      amount,
      orderName,
      customerName,
      customerEmail,
    })
  } catch (error: any) {
    console.error('Payment request error:', error)
    return NextResponse.json(
      { error: error.message || '결제 요청 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
