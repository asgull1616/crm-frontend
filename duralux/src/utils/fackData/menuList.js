export const menuList = [
    {
        id: 0,
        name: "dashboards",
        path: "/",
        icon: 'feather-airplay',
        dropdownMenu: [
            // {
            //     id: 1,
            //     name: "CRM",
            //     path: "/",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 2,
            //     name: "Analytics",
            //     path: "/dashboards/analytics",
            //     subdropdownMenu: false
            // }
        ]
    },
    // {
    //     id: 1,
    //     name: "reports",
    //     path: "#",
    //     icon: 'feather-cast',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Sales Report",
    //             path: "/reports/sales",
    //             subdropdownMenu: false
    //         },
    //         
    //         {
    //             id: 3,
    //             name: "Project Report",
    //             path: "/reports/project",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Timesheets Report",
    //             path: "/reports/timesheets",
    //             subdropdownMenu: false
    //         },

    //     ]
    // },
    // {
    //     id: 2,
    //     name: "applications",
    //     path: '#',
    //     icon: 'feather-send',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Chat",
    //             path: "/applications/chat",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Email",
    //             path: "/applications/email",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Tasks",
    //             path: "/applications/tasks",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Notes",
    //             path: "/applications/notes",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 5,
    //             name: "Storage",
    //             path: "/applications/storage",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 6,
    //             name: "Calendar",
    //             path: "/applications/calendar",
    //             subdropdownMenu: false
    //         },
    //     ]
    // },
    {
        id: 3,
        name: "Teklifler",
        path: "#",
        icon: 'feather-at-sign',
        dropdownMenu: [
            {
                id: 1,
                name: "Teklifleri Görüntüle",
                path: "/proposal/list",
                subdropdownMenu: false
            },
            // {
            //     id: 2,
            //     name: "Teklifler Görüntüle",
            //     path: "/proposal/view",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 3,
            //     name: "Teklifleri Görüntüle",
            //     path: "/proposal/edit",
            //     subdropdownMenu: false
            // },
            {
                id: 4,
                name: "Teklif Oluştur",
                path: "/proposal/create",
                subdropdownMenu: false
            },

        ],
    },
    // {
    //     id: 4,
    //     name: "payment",
    //     path: "#",
    //     icon: 'feather-dollar-sign',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Payment",
    //             path: "/payment/list",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Invoice View",
    //             path: "/payment/view",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Invoice Create",
    //             path: "/payment/create",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    {
        id: 5,
        name: "Müşteriler",
        path: "#",
        icon: 'feather-users',
        _dropdownMenu: [
            {
                id: 1,
                name: "Müşterileri Görüntüle",
                path: "/customers/list",
                subdropdownMenu: false
            },
            // {
            //     id: 2,
            //     name: "Müşteri Görüntüle",
            //     path: "/customers/view",
            //     subdropdownMenu: false
            // },
            {
                id: 3,
                name: "Müşteri Oluştur",
                path: "/customers/create",
                subdropdownMenu: false
            }
        ],
        get dropdownMenu() {
            return this._dropdownMenu;
        },
        set dropdownMenu(value) {
            this._dropdownMenu = value;
        },
    },
    {
    id: 6,
    name: "Ekipler",
    path: "/teams/list",
    icon: 'feather-users',
    dropdownMenu: [
        {
            id: 1,
            name: "Ekipleri Görüntüle",
            path: "/teams/list",
            subdropdownMenu: false
        },
        {
            id: 2,
            name: "Ekip Oluştur",
            path: "/teams/create",
            subdropdownMenu: false
        }
    ]
},
    {
        id: 7,
        name: "Görevler",
        path: "#",
        icon: 'feather-briefcase',
        dropdownMenu: [
            {
                id: 1,
                name: "Görevler",
                path: "/projects/list",
                subdropdownMenu: false
            },
            //{
             //   id: 2,
               // name: "Görevleri Görüntüle",
               // path: "/projects/view",
               // subdropdownMenu: false
            //},
            {
                id: 3,
                name: "Görev Yarat",
                path: "/projects/create",
                subdropdownMenu: false
            }
        ]
    },
    // {
    //     id: 8,
    //     name: "widgets",
    //     path: "#",
    //     icon: 'feather-layout',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Lists",
    //             path: "/widgets/lists",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Tables",
    //             path: "/widgets/tables",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Charts",
    //             path: "/widgets/charts",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Statistics",
    //             path: "/widgets/statistics",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 5,
    //             name: "Miscellaneous",
    //             path: "/widgets/miscellaneous",
    //             subdropdownMenu: false
    //         },
    //     ]
    // },
    {
        id: 9,
        name: "Ayarlar",
        path: "#",
        icon: 'feather-settings',
        dropdownMenu: [
            {
                id: 1,
                name: "Ganeral",
                path: "/settings/ganeral",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "SEO",
                path: "/settings/seo",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Tags",
                path: "/settings/tags",
                subdropdownMenu: false
            },
            {
                id: 4,
                name: "Email",
                path: "/settings/email",
                subdropdownMenu: false
            },
            {
                id: 5,
                name: "Tasks",
                path: "/settings/tasks",
                subdropdownMenu: false
            },
            
            {
                id: 7,
                name: "Support",
                path: "/settings/Support",
                subdropdownMenu: false
            },
            {
                id: 8,
                name: "Finance",
                path: "/settings/finance",
                subdropdownMenu: false
            },
            {
                id: 9,
                name: "Gateways",
                path: "/settings/gateways",
                subdropdownMenu: false
            },
            {
                id: 10,
                name: "Customers",
                path: "/settings/customers",
                subdropdownMenu: false
            },
            {
                id: 11,
                name: "Localization",
                path: "/settings/localization",
                subdropdownMenu: false
            },
            {
                id: 12,
                name: "reCAPTCHA",
                path: "/settings/recaptcha",
                subdropdownMenu: false
            },
            {
                id: 13,
                name: "Miscellaneous",
                path: "/settings/miscellaneous",
                subdropdownMenu: false
            },
        ]
    },
    // {
    //     id: 10,
    //     name: "Giriş / Kimlik Doğrulama",
    //     path: "#",
    //     icon: 'feather-power',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Giriş",
    //             path: "/authentication/login/minimal",
    //             subdropdownMenu: [
                    // {
                    //     id: 1,
                    //     name: "Cover",
                    //     path: "/authentication/login/cover",
                    // },
                    // {
                    //     id: 2,
                    //     name: "Minimal",
                    //     path: "/authentication/login/minimal",
                    // },
                    // {
                    //     id: 3,
                    //     name: "Creative",
                    //     path: "/authentication/login/creative",
                    // },
            //     ]
            // },
            // {
            //     id: 2,
            //     name: "Kayıt",
            //     path: "/authentication/register/minimal",
            //     subdropdownMenu: [
                    // {
                    //     id: 1,
                    //     name: "Cover",
                    //     path: "/authentication/register/cover",
                    // },
                    // {
                    //     id: 2,
                    //     name: "Minimal",
                    //     path: "/authentication/register/minimal",
                    // },
                    // {
                    //     id: 3,
                    //     name: "Creative",
                    //     path: "/authentication/register/creative",
                    // },
            //     ]
            // },
            // {
            //     id: 3,
            //     name: "Error 404",
            //     path: "#",
            //     subdropdownMenu: [
            //         {
            //             id: 1,
            //             name: "Cover",
            //             path: "/authentication/404/cover",
            //         },
            //         {
            //             id: 2,
            //             name: "Minimal",
            //             path: "/authentication/404/minimal",
            //         },
            //         {
            //             id: 3,
            //             name: "Creative",
            //             path: "/authentication/404/creative",
            //         },
            //     ]
            // },
            // {
            //     id: 4,
            //     name: "Reset Pass",
            //     path: "#",
            //     subdropdownMenu: [
            //         {
            //             id: 1,
            //             name: "Cover",
            //             path: "/authentication/reset/cover",
            //         },
            //         {
            //             id: 2,
            //             name: "Minimal",
            //             path: "/authentication/reset/minimal",
            //         },
            //         {
            //             id: 3,
            //             name: "Creative",
            //             path: "/authentication/reset/creative",
            //         },
            //     ]
            // },
            // {
            //     id: 5,
            //     name: "Verify OTP",
            //     path: "#",
            //     subdropdownMenu: [
            //         {
            //             id: 1,
            //             name: "Cover",
            //             path: "/authentication/verify/cover",
            //         },
            //         {
            //             id: 2,
            //             name: "Minimal",
            //             path: "/authentication/verify/minimal",
            //         },
            //         {
            //             id: 3,
            //             name: "Creative",
            //             path: "/authentication/verify/creative",
            //         },
            //     ]
            // },
            // {
            //     id: 6,
            //     name: "Maintenance",
            //     path: "#",
            //     subdropdownMenu: [
            //         {
            //             id: 1,
            //             name: "Cover",
            //             path: "/authentication/maintenance/cover",
            //         },
            //         {
            //             id: 2,
            //             name: "Minimal",
            //             path: "/authentication/maintenance/minimal",
            //         },
            //         {
            //             id: 3,
            //             name: "Creative",
            //             path: "/authentication/maintenance/creative",
            //         },
            //     ]
            // },
    //     ]
    // },
    // {
    //     id: 11,
    //     name: "help center",
    //     path: "#",
    //     icon: 'feather-life-buoy',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Support",
    //             path: "https://wrapbootstrap.com/user/theme_ocean",
    //             target:"_blank",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "KnowledgeBase",
    //             path: "/help/knowledgebase",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Documentations",
    //             path: "https://duralux-next-doc.vercel.app/",
    //             target:"_blank",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    
]