import prismaMock from '../prisma-mock';
import {
  createArticle,
  updateArticle,
  addComment,
  deleteComment,
  favoriteArticle,
  unfavoriteArticle,
} from '../../app/routes/article/article.service';

describe('ArticleService', () => {
  describe('input validation', () => {
    const articleDb = (
      prismaMock as unknown as { article: Record<string, jest.Mock> }
    ).article;
    const commentDb = (
      prismaMock as unknown as { comment: Record<string, jest.Mock> }
    ).comment;
    const validArticle = {
      title: 'Title',
      description: 'Description',
      body: 'Body',
    };

    test.each(['', 'x'.repeat(201), null, 123])(
      'createArticle rejects invalid title %p with 422 before database writes',
      async (title) => {
        await expect(
          createArticle({ ...validArticle, title }, 1)
        ).rejects.toMatchObject({ errorCode: 422 });
        expect(articleDb.findUnique).not.toHaveBeenCalled();
        expect(articleDb.create).not.toHaveBeenCalled();
      }
    );

    test.each(['', 'x'.repeat(201), null, 123])(
      'updateArticle rejects a supplied invalid title %p with 422',
      async (title) => {
        await expect(updateArticle({ title }, 'slug', 1)).rejects.toMatchObject(
          { errorCode: 422 }
        );
        expect(articleDb.findFirst).not.toHaveBeenCalled();
        expect(articleDb.update).not.toHaveBeenCalled();
      }
    );

    test.each(['', 'x'.repeat(1001)])(
      'addComment rejects invalid body with 422',
      async (body) => {
        await expect(addComment(body, 'slug', 1)).rejects.toMatchObject({
          errorCode: 422,
        });
        expect(articleDb.findUnique).not.toHaveBeenCalled();
        expect(commentDb.create).not.toHaveBeenCalled();
      }
    );

    test('createArticle accepts a 200-character title', async () => {
      const databaseReached = new Error('database reached');
      articleDb.findUnique.mockRejectedValue(databaseReached);
      await expect(
        createArticle({ ...validArticle, title: 'x'.repeat(200) }, 1)
      ).rejects.toBe(databaseReached);
    });

    test.each([{ title: 'x'.repeat(200) }, { body: 'Updated body' }])(
      'updateArticle accepts the maximum title or an omitted title',
      async (article) => {
        const databaseReached = new Error('database reached');
        articleDb.findFirst.mockRejectedValue(databaseReached);
        await expect(updateArticle(article, 'slug', 1)).rejects.toBe(
          databaseReached
        );
      }
    );

    test('addComment accepts a 1000-character body', async () => {
      const databaseReached = new Error('database reached');
      articleDb.findUnique.mockRejectedValue(databaseReached);
      await expect(addComment('x'.repeat(1000), 'slug', 1)).rejects.toBe(
        databaseReached
      );
    });
  });

  describe('deleteComment', () => {
    test('should throw 404 when the comment is missing', async () => {
      // Given
      const id = 123;
      const idUser = 456;

      // When
      // @ts-ignore
      prismaMock.comment.findFirst.mockResolvedValue(null);

      // Then
      await expect(deleteComment(id, idUser)).rejects.toMatchObject({
        errorCode: 404,
      });
      expect(prismaMock.comment.delete).not.toHaveBeenCalled();
    });
  });

  describe('favoriteArticle', () => {
    test('should return the favorited article', async () => {
      // Given
      const slug = 'How-to-train-your-dragon';
      const username = 'RealWorld';

      const mockedUserResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      const mockedArticleResponse = {
        id: 123,
        slug: 'How-to-train-your-dragon',
        title: 'How to train your dragon',
        description: '',
        body: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 456,
        tagList: [],
        favoritedBy: [],
        author: {
          username: 'RealWorld',
          bio: null,
          image: null,
          followedBy: [],
        },
      };

      // When
      // @ts-ignore
      prismaMock.user.findUnique.mockResolvedValue(mockedUserResponse);
      // @ts-ignore
      prismaMock.article.update.mockResolvedValue(mockedArticleResponse);

      // Then
      await expect(
        favoriteArticle(slug, mockedUserResponse.id)
      ).resolves.toHaveProperty('favoritesCount');
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const id = 123;
      const slug = 'how-to-train-your-dragon';
      const username = 'RealWorld';

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      await expect(favoriteArticle(slug, id)).rejects.toThrowError();
    });
  });
  describe('unfavoriteArticle', () => {
    test('should return the unfavorited article', async () => {
      // Given
      const slug = 'How-to-train-your-dragon';
      const username = 'RealWorld';

      const mockedUserResponse = {
        id: 123,
        username: 'RealWorld',
        email: 'realworld@me',
        password: '1234',
        bio: null,
        image: null,
        token: '',
        demo: false,
      };

      const mockedArticleResponse = {
        id: 123,
        slug: 'How-to-train-your-dragon',
        title: 'How to train your dragon',
        description: '',
        body: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 456,
        tagList: [],
        favoritedBy: [],
        author: {
          username: 'RealWorld',
          bio: null,
          image: null,
          followedBy: [],
        },
      };

      // When
      prismaMock.user.findUnique.mockResolvedValue(mockedUserResponse);
      prismaMock.article.update.mockResolvedValue(mockedArticleResponse);

      // Then
      await expect(
        unfavoriteArticle(slug, mockedUserResponse.id)
      ).resolves.toHaveProperty('favoritesCount');
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const id = 123;
      const slug = 'how-to-train-your-dragon';
      const username = 'RealWorld';

      // When
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Then
      await expect(unfavoriteArticle(slug, id)).rejects.toThrowError();
    });
  });
});
