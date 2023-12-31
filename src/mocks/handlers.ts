// mocks/handlers.js
import { rest } from 'msw';

const mockTags = [
  { id: 1, name: 'Tag 1' },
  { id: 2, name: 'Tag 2' },
]

export const handlers = [
    rest.post(`${process.env.VITE_BACKEND_URL}/api/auth/login`, (req, res, ctx) => {
      const { user, password } = req.body as any;
  
      if (user === 'test' && password === 'test') {
        return res(
          ctx.json({
            name: 'test',
            token: 'test_token',
          })
        );
      } else {
        return res(
          ctx.status(403),
          ctx.json({
            message: 'Invalid credentials',
          })
        );
      }
    }),
    rest.post(`${process.env.VITE_BACKEND_URL}/api/auth/signin`, (req, res, ctx) => {
      // similarly mock response for sign-in
    }),

    rest.get(`${process.env.VITE_BACKEND_URL}/api/tag`, async (req, res, ctx) => {
      return res(ctx.status(200),ctx.json(mockTags))
    }),
    rest.get('https://swapi.dev/api/planets', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        results: [
          { name: 'Tatooine', population: '200000' },
          { name: 'Alderaan', population: '2000000000' },
        ],
      })
    )
  })
  ];
