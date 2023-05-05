# Contributing to Buho Stocks

When contributing to this repository, please first discuss the change you wish to
make via issue with the owners of this repository before making a change.

## Branching

If you would like to contribute to this project, you will need to use
[git flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). This way, any and all changes
happen on the development branch and not on the master branch. As such, after
you have git-flow-ified your `buho-stocks` git repo, create a pull request for your
branch, and we'll take it from there.

## Git Commit guidelines

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line
6. Wrap the body at 72 characters
7. Use the body to explain what and why vs. how

Source: https://chris.beams.io/posts/git-commit/

## Pull request guidelines

> :warning: When submitting a Pull Request to this project for something more than a typo or small bug,
**please make sure your idea was discussed beforehand** with the development team, via an
[issue](https://github.com/bocabitlabs/buho-stocks/issues/new/choose).

Open Source is about contributing back, but it's important to know how to do it in the best way possible.
We don't want you to spend your precious time in a "ping-pong" of code reviews that will end up not being fun.
We also want to maximize the chances that your contribution will already be done following what we consider good practices.

1. The subject line should be a one-sentence summary, and should not include
   the word *and* (explicitly or implied).
2. Any extra detail should be provided in the body of the PR.
3. Don't submit unrelated changes in the same pull request.
4. If you had a bit of churn in the process of getting the change right,
   squash your commits. Refer to the guidelines on [squashing commits](git-basics.md#squashing).
5. If you had to refactor in order to add your change, then we'd love to
   see two commits: First the refactoring, then the added behavior. It's
   fine to put this in the same pull request, unless the refactoring is
   huge and would make it hard to review both at the same time.
6. If you are referencing another issue or pull-request, for instance
   *closes #XXX*, *see #XXX*, please include the reference in the body of the PR,
   rather than the subject line. This is simply because the subject line doesn't
   support markdown, and so these don't get turned into clickable links. It makes
   it harder to follow and to go look at the related issue or PR.
7. Please also refer to the guidelines for [commit messages](git-basics.md#commit-messages).

Once you've submitted a pull request, one or more of the maintainers will review it if all checks (tests and coverage pass).
