import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import logoUrl from '~/assets/logo.png'

export const Header: FC = () => {
  const navigateTo = useNavigate()

  return <div h-full w-full flex="~ row" items-center justify-between>
    <div cursor-pointer className="h-50%">
      <img align-top h-full object-cover src={logoUrl} alt="MD REPORT" onClick={() => navigateTo('/')} />
    </div>
    <div></div>
  </div>
}
