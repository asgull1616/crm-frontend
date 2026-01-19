export const menuList = [
  {
    id: 0,
    name: "dashboards",
    path: "/",
    icon: "feather-airplay",
    dropdownMenu: [

    ],
  },
  {
    id: 3,
    name: "Teklifler",
    path: "#",
    icon: "feather-at-sign",
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
    id: 5,
    name: "Müşteriler",
    path: "#",
    icon: "feather-users",
    _dropdownMenu: [
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
    icon: "feather-users",
    dropdownMenu: [
      {
        id: 1,
        name: "Ekipleri Görüntüle",
        path: "/teams/list",
        subdropdownMenu: false,
      },
      {
        id: 2,
        name: "Ekip Oluştur",
        path: "/teams/create",
        subdropdownMenu: false,
      },
    ],
  },
  {
    id: 7,
    name: "Görevler",
    path: "#",
    icon: "feather-briefcase",
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
    id: 8,
    name: "Gelir / Gider",
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
  
];
