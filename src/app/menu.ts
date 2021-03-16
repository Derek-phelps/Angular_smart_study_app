export let MENU_super_ITEM = [
    {
        path: 'registrations',
        title: 'menu.Registrations',
        icon: 'users'
    },
    {
        path: 'course',
        title: 'menu.Course',
        icon: 'book'
    },
];
export let MENU_admin_ITEM = [
    {
        path: 'mycourses',
        title: 'course.MyCourses',
        icon: 'book',
    },
    {
        path: 'mycertificates',
        title: 'menu.MyCertificates',
        icon: 'graduation-cap',
        separateAfter: true
    },
    {
        path: 'dashboard',
        title: 'menu.Dashboard',
        icon: 'dashboard'
    },
    {
        path: 'company',
        title: 'menu.Settings',
        icon: 'cogs'
    },
    {
        path: 'employees',
        title: 'menu.Employees',
        icon: 'user'
    },
    {
        path: 'department',
        title: 'menu.Departments',
        icon: 'building'
    },
    {
        path: 'groups',
        title: 'menu.Groups',
        icon: 'users'
    },
    {
        path: 'course',
        title: 'menu.Course',
        icon: 'book'
    },
];
export let MENU_admin_ITEM_fagus = [
    {
        path: 'dashboard',
        title: 'menu.Dashboard',
        icon: 'dashboard'
    },
    {
        title: 'menu.Company',
        icon: 'industry',
        toggle: 'off',
        children: [
            {
                path: 'company',
                title: 'menu.Company'
            },
            {
                path: 'employees',
                title: 'menu.Employees'
            },
            {
                path: 'department',
                title: 'menu.Departments'
            },
        ]
    },
    {
        title: 'menu.Course',
        icon: 'book',
        toggle: 'off',
        children: [
            {
                path: 'course',
                title: 'menu.Course'
            },
            {
                path: 'certificater',
                title: 'menu.Certificater'
                //icon: 'graduation-cap'
            }
        ]
    },
    {
        path: 'message',
        title: 'menu.Messages',
        icon: 'envelope-open'
    },
    {
        path: 'position',
        title: 'menu.Positions',
        icon: 'table'
    },
    {
        path: 'location',
        title: 'menu.Locations',
        icon: 'bullseye'
    },
    {
        path: 'feedback',
        title: 'menu.Feedback',
        icon: 'quote-right'
    },
];
export let MENU_trainer_employee_ITEM = [
    {
        path: 'dashboard',
        title: 'menu.Dashboard',
        icon: 'dashboard'
    },
    {
        path: 'course',
        title: 'menu.Course',
        icon: 'book'
    },
    {
        path: 'content',
        title: 'menu.Content',
        icon: 'film'
    },
    {
        path: 'certificater',
        title: 'menu.Certificater',
        icon: 'graduation-cap'
    },
    {
        path: 'message',
        title: 'menu.Messages',
        icon: 'diamond'
    },
    {
        path: 'feedback',
        title: 'menu.Feedback',
        icon: 'user'
    }
];
export let MENU_employee_ITEM = [
    {
        path: 'mycourses',
        title: 'course.MyCourses',
        icon: 'book',
    },
    {
        path: 'mycertificates',
        title: 'menu.MyCertificates',
        icon: 'graduation-cap',
        separateAfter: true
    },
    {
        path: 'department',
        title: 'menu.MyDepartments',
        icon: 'building',
        checkDepartments: true
    },
    {
        path: 'groups',
        title: 'menu.MyGroups',
        icon: 'users',
        checkGroups: true
    },
    {
        path: 'course',
        title: 'menu.Course',
        icon: 'book',
        checkCourses: true
    },
];