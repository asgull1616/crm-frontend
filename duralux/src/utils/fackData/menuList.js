export const menuList = [
  {
    id: 0,
    name: "Dashboards",
    path: "/",
    icon: "feather-grid",
    dropdownMenu: [],
  },

  {
    id: 10,
    name: "Projelerimiz",
    path: "#",
    icon: "feather-folder",
    dropdownMenu: [
      {
        id: 1,
        name: "Proje Kartları",
        path: "/projects/board",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 9,
    name: "Plan & Akış",
    path: "#",
    icon: "feather-layers",
    dropdownMenu: [
      {
        id: 1,
        name: "Pano",
        path: "/program/board",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Plan",
        path: "/program/plan",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 8,
    name: "Ödemeler",
    path: "#",
    icon: "feather-dollar-sign",
    dropdownMenu: [
      {
        id: 1,
        name: "Gelir/Gider Görüntüle",
        path: "/income-expense/list",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Gelir/Gider Oluştur",
        path: "/income-expense/create",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 6,
    name: "Ekipler",
    path: "#",
    icon: "feather-users",
    dropdownMenu: [
      {
        id: 2,
        name: "Ekip Listesi",
        path: "/teams/list",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Çalışanlar",
        path: "/teams/employees",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "İzinler",
        path: "/teams/leaves",
        subdropdownMenu: false,
      },
      {
        id: 5,
        name: "Maaş & Ödemeler",
        path: "/teams/salary",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 7,
    name: "Görevler",
    path: "#",
    icon: "feather-check-circle",
    dropdownMenu: [
      {
        id: 1,
        name: "Görevler",
        path: "/tasks/list",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Görev Yarat",
        path: "/tasks/create",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 5,
    name: "Müşteriler",
    path: "#",
    icon: "feather-user",
    dropdownMenu: [
      {
        id: 1,
        name: "Müşterileri Görüntüle",
        path: "/customers/list",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Müşteri Oluştur",
        path: "/customers/create",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 3,
    name: "Teklifler",
    path: "#",
    icon: "feather-file-text",
    dropdownMenu: [
      {
        id: 1,
        name: "Teklifleri Görüntüle",
        path: "/proposal/list",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Teklif Oluştur",
        path: "/proposal/create",
        subdropdownMenu: false,
      },
    ],
  },

  {
    id: 11,
    name: "Dosyalar",
    path: "#",
    icon: "feather-file",
    dropdownMenu: [
      {
        id: 1,
        name: "Sözleşmeler",
        path: "/files/contracts",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Kaynak Kod Linkleri",
        path: "/files/source",
        subdropdownMenu: false,
      },
      {
        id: 3,
        name: "Lisanslar",
        path: "/files/licenses",
        subdropdownMenu: false,
      },
      {
        id: 4,
        name: "Hosting Bilgileri",
        path: "/files/hosting",
        subdropdownMenu: false,
      },
    ],
  },
];
