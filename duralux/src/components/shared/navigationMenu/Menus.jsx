'use client'

import React, { Fragment, useEffect, useState, useMemo } from "react";
import { FiChevronRight } from "react-icons/fi";
import { menuList } from "@/utils/fackData/menuList";
import getIcon from "@/utils/getIcon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const Menus = () => {
    const { role } = useAuth();
    const pathName = usePathname();

    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");

    // 🎯 ROLE FILTER
    const filteredMenuList = useMemo(() => {

        if (!role) return [];

        return menuList
            .map((menu) => {

                if (menu.roles && !menu.roles.includes(role)) {
                    return null;
                }

                const filteredDropdown = menu.dropdownMenu?.filter((sub) => {
                    if (!sub.roles) return true;
                    return sub.roles.includes(role);
                }) || [];

                return {
                    ...menu,
                    dropdownMenu: filteredDropdown
                };
            })
            .filter(Boolean);

    }, [role]);

    // 🧠 Active state
    useEffect(() => {
        if (pathName !== "/") {
            const x = pathName.split("/");
            setActiveParent(x[1]);
            setActiveChild(x[2]);
            setOpenDropdown(x[1]);
            setOpenSubDropdown(x[2]);
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName]);

    return (
        <>
            {filteredMenuList.map(({ dropdownMenu, id, name, path, icon }) => (
                <li
                    key={id}
                    onClick={() =>
                        setOpenDropdown(prev =>
                            prev === name.split(' ')[0]
                                ? null
                                : name.split(' ')[0]
                        )
                    }
                    className={`nxl-item nxl-hasmenu ${
                        activeParent === name.split(' ')[0]
                            ? "active nxl-trigger"
                            : ""
                    }`}
                >
                    <Link href={path} className="nxl-link text-capitalize">
                        <span className="nxl-micon">
                            {getIcon(icon)}
                        </span>
                        <span
                            className="nxl-mtext"
                            style={{ paddingLeft: "2.5px" }}
                        >
                            {name}
                        </span>
                        {dropdownMenu.length > 0 && (
                            <span className="nxl-arrow fs-16">
                                <FiChevronRight />
                            </span>
                        )}
                    </Link>

                    {dropdownMenu.length > 0 && (
                        <ul
                            className={`nxl-submenu ${
                                openDropdown === name.split(' ')[0]
                                    ? "nxl-menu-visible"
                                    : "nxl-menu-hidden"
                            }`}
                        >
                            {dropdownMenu.map(
                                ({ id, name, path, subdropdownMenu, target }) => {
                                    const x = name;

                                    return (
                                        <Fragment key={id}>
                                            {subdropdownMenu?.length ? (
                                                <li
                                                    className={`nxl-item nxl-hasmenu ${
                                                        activeChild === name
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenSubDropdown(prev =>
                                                            prev === x
                                                                ? null
                                                                : x
                                                        );
                                                    }}
                                                >
                                                    <Link
                                                        href={path}
                                                        className="nxl-link text-capitalize"
                                                    >
                                                        <span className="nxl-mtext">
                                                            {name}
                                                        </span>
                                                        <span className="nxl-arrow">
                                                            <FiChevronRight />
                                                        </span>
                                                    </Link>

                                                    <ul
                                                        className={`nxl-submenu ${
                                                            openSubDropdown === x
                                                                ? "nxl-menu-visible"
                                                                : "nxl-menu-hidden"
                                                        }`}
                                                    >
                                                        {subdropdownMenu.map(
                                                            ({
                                                                id,
                                                                name,
                                                                path,
                                                            }) => (
                                                                <li
                                                                    key={id}
                                                                    className={`nxl-item ${
                                                                        pathName ===
                                                                        path
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <Link
                                                                        className="nxl-link text-capitalize"
                                                                        href={
                                                                            path
                                                                        }
                                                                    >
                                                                        {name}
                                                                    </Link>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            ) : (
                                                <li
                                                    className={`nxl-item ${
                                                        pathName === path
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <Link
                                                        className="nxl-link"
                                                        href={path}
                                                        target={target}
                                                    >
                                                        {name}
                                                    </Link>
                                                </li>
                                            )}
                                        </Fragment>
                                    );
                                }
                            )}
                        </ul>
                    )}
                </li>
            ))}
        </>
    );
};

export default Menus;