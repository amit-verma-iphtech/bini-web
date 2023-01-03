export const Config = {
  bucketUrl: `${process.env.PUBLIC_URL}/snippets`,
  validUserRoles: {
    operator: 'operator',
    admin: 'admin',
    retailer: 'retailer',
    user: 'user',
  },
  validOrganizationRoles: {
    viewer: 'viewer',
    editor: 'editor',
    admin: 'admin'
  },
  version: '2.7'
};
