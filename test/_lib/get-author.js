import GetAuthor from '../../src/app/_lib/get-author';

describe('GetAuthor', () => {
  let post;

  beforeEach(() => {
    post = {
      _embedded: {
        author: [{
          _links: {},
          avatar_urls: {},
          contact_methods: {},
          description: null,
          first_name: null,
          id: null,
          last_name: null,
          link: null,
          name: null,
          url: null
        }]
      },
      _links: {},
      author: null,
      colors: {},
      comment_status: null,
      date: null,
      display_title: null,
      excerpt: {},
      facebookShares: null,
      featured_image: null,
      format: null,
      guid: {},
      id: null,
      link: null,
      modified: null,
      modified_gmt: null,
      page_builder: [],
      ping_status: null,
      seo: {},
      slug: null,
      sticky: null,
      terms: {},
      title: {},
      twitterShares: null,
      type: "post"
    }
  });

  it('should return the first and last name of the author', () => {
    Object.assign(post._embedded.author[0], {
      first_name: "Bob",
      last_name: "Dylan",
      name: "spongebob"
    });
    expect(GetAuthor(post)).to.equal("Bob Dylan");
  });

  describe('edge cases', () => {
    it('should return the username if the first name is not present', () => {
      Object.assign(post._embedded.author[0], {
        last_name: "Dylan",
        name: "spongebob"
      });
      expect(GetAuthor(post)).to.equal("spongebob");
    });

    it('should return the first name if only the first name is present', () => {
      Object.assign(post._embedded.author[0], {
        first_name: "Bob",
        name: "spongebob"
      });
      expect(GetAuthor(post)).to.equal("Bob");
    });
  });

});