import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useThemeStore } from '../store/useThemeStore';

const Layout = ({children,showSidebar = false}) => {

  const { theme } = useThemeStore();

  return (
    <div className='min-h-screen'>
        <div className='flex'>
           {showSidebar && <Sidebar />}

           <div className='flex flex-col flex-1'>
            <Navbar />
            <main className='flex-1 overflow-y-auto'>
                {children}
            </main>
           </div>
        </div>
            <p class="footer-heart font-mono text-center py-4" data-theme={theme}>
              Made with ❤️ by <a href="https://github.com/xSAYYAMx"><span className='underline text-red-400'>xSAYYAMx</span></a>
            </p>
    </div>
  )
}

export default Layout