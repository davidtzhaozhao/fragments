Meteor.methods({
  createTutorial: function (user) {
    check(user, Object);
    check(user._id, String);
    check(user.profile, Object);
    check(user.profile.name, Match.OneOf(String, undefined));

    var displayName = user.profile.name ? user.profile.name.split(' ')[0] : '';

    function insertFragment (data) {
      return Fragments.insert({
        user: {
          _id: user._id,
          name: user.profile.name,
          picture: user.profile.picture
        },
        fetched_at: Date.now(),
        title: data.title,
        description: data.description,
        images: [ { url: data.image } ],
        tags: data.tags,
        collections: data.collections
      });
    }

    var stuffCollection = Collections.shrink(
      Collections.findOne(
        Meteor.call('collectionInsert', {
          user: user._id,
          name: 'Stuff',
          color: '#ff9e9d'
        })
      )
    );

    var interestingCollection = Collections.shrink(
      Collections.findOne(
        Meteor.call('collectionInsert', {
          user: user._id,
          name: 'Interesting',
          color: '#f9d423'
        })
      )
    );

    Meteor.call('collectionInsert', {
      user: user._id,
      name: 'Work',
      color: '#16c1c8'
    });

    insertFragment({
      title: 'Tag your fragments',
      description: 'You can add as many tags as you want on each fragment, and filter your results by one or more. Right click here to get started editing this card!',
      image: Meteor.absoluteUrl('/assets/img/tutorial/tags.jpg'),
      tags: ['Tutorial', 'Cute stuff'],
      collections: [interestingCollection, stuffCollection]
    });

    insertFragment({
      title: 'Infinite storage',
      description: 'Limited space? We have never heard of that, so you should probably not really worry about saving here all your fragments.',
      image: Meteor.absoluteUrl('/assets/img/tutorial/storage.png'),
      tags: ['Tutorial', 'Storage'],
      collections: [stuffCollection]
    });

    var fragmentId = insertFragment({
      title: ['Hey', displayName + '!'].join(' '),
      description: 'Welcome to Fragments! This is your very first fragment, displayed here as a tutorial card. To dismiss it, right click here on select "Delete".',
      image: Meteor.absoluteUrl('/assets/img/tutorial/welcome.png'),
      tags: ['Tutorial'],
      collections: []
    });

    Comments.insert({
      fragment: fragmentId,
      text: 'Glad you find me! Here\'s a comment, why don\'t you add one to try out how this works?',
      user: {
        _id: user._id,
        name: 'Fragments',
        picture: '/assets/img/logo.png'
      }
    });

    SearchHistory.insert({
      user: user._id,
      query: 'tutorial'
    });
  }
});