import { PartyAppPage } from './app.po';

describe('party-app App', () => {
  let page: PartyAppPage;

  beforeEach(() => {
    page = new PartyAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
