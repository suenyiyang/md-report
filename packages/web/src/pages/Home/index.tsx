import type { FC } from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import logoUrl from '~/assets/logo.png'

export const Home: FC = () => {
  const navigateTo = useNavigate()

  return <div flex="~ col" items-center bg-white h-full p-1>
    <div mt-30>
      <img w-76 object-cover src={logoUrl} alt="MD REPORT" />
    </div>
    <div mt-10 text-14 font-700 text-center>Markdown Report</div>
    <div mt-10 text="6" opacity-60 font-500 text-center>Write reports in markdown, and get them in docx.</div>
    <div mt-10>
      <Button shape="round" type="primary" size="large" onClick={() => navigateTo('/transformer?step=0')}>Get Started</Button>
    </div>
  </div>
}
