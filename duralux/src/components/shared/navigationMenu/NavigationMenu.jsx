'use client'
import React, { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PerfectScrollbar from "react-perfect-scrollbar";
import { FiSunrise } from "react-icons/fi";
import Menus from './Menus';
import { NavigationContext } from '@/contentApi/navigationProvider';

const NavigationManu = () => {
  const { navigationOpen, setNavigationOpen } = useContext(NavigationContext)
  const pathName = usePathname()
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setNavigationOpen(false)
  }, [pathName])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const updateDark = () => {
      const el = document.documentElement
      setIsDark(el.classList.contains('app-skin-dark'))
    }
    updateDark()
    const observer = new MutationObserver(() => updateDark())
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return (
    <nav className={`nxl-navigation ${navigationOpen ? "mob-navigation-active" : ""}`}>
      <div className="navbar-wrapper">
        <div className="m-header">
          <Link href="/" className="b-brand">
            {/* <!-- ========   change your logo hear   ============ --> */}
            {isDark ? (
              <Image width={140} height={30} src="/images/logo-green-White.png" alt="logo" className="logo logo-lg" style={{ filter: 'none' }} />
            ) : (
              <Image
                src="/images/logo-green.png"
                alt="logo"
                className="logo logo-lg"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "200px", height: "auto" }}
              />)}
            <Image width={140} height={30} src="/images/codyol.png" alt="logo" className="logo logo-sm" />
          </Link>
        </div>

        <div className={`navbar-content`}>
          <PerfectScrollbar>
            <ul className="nxl-navbar">
              <li className="nxl-item nxl-caption">
                <label>Menu</label>
              </li>
              <Menus />
            </ul>
            {/* <div className="card text-center">
                            <div className="card-body">
                                <i className="fs-4 text-dark"><FiSunrise /></i>
                                <h6 className="mt-4 text-dark fw-bolder">Downloading Center</h6>
                                <p className="fs-11 my-3 text-dark">Duralux is a production ready CRM to get started up and running easily.</p>
                                <Link href="#" className="btn btn-primary text-dark w-100">Download Now</Link>
                            </div>
                        </div> */}
            <div style={{ height: "18px" }}></div>
          </PerfectScrollbar>
        </div>
      </div>
      <div onClick={() => setNavigationOpen(false)} className={`${navigationOpen ? "nxl-menu-overlay" : ""}`}></div>
    </nav>
  )
}

export default NavigationManu