// import { projectStatusOptions, taskAssigneeOptions } from '@/utils/options';

import { projectStatusOptions, taskAssigneeOptions } from "../options"

const status = projectStatusOptions
const assigned = taskAssigneeOptions

export const projectTableData = [
    {
        "id": 1,
        "project-name": {
            "title": "Spark: This name could work well for a project related to innovation, creativity, or inspiration.",
            "img": "/images/brand/app-store.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Alexandra Della",
            "img": ""
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'arcie.tones@gmail.com' },
        "status": { status, defaultSelect: 'in-projress' }
    },
    
]