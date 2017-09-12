import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  subtitle: DS.attr('string'),
  image: DS.attr('string'),
  type: DS.attr('string'),
  description: DS.attr('string'),
  version: DS.attr('string'),
  filename: DS.attr('string'),
  fgColor: DS.attr('string'),
  bgColor: DS.attr('string')
});
