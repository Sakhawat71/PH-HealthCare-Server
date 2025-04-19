
export const adminAllowedFields = [
    'name',
    'searchTerm',
    'email',
    'contactNumber',
];

export const paginateAllowedFieds = [
    'page',
    'limit',
    'sortBy',
    'sortOrder'
]
export const adminSearchAbleFields = ['name', 'email'];

export const pick = (query: any, fields: any) => {
    const filteredQuery: Record<string, any> = {};
    for (const key of fields) {
        if (query[key]) {
            filteredQuery[key] = query[key]
        }
    };
    return filteredQuery;
};