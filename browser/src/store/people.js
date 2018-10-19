import { gitHubUserRepositories } from '~/integrations/github/queries';
import { gitHubGraphQlRequest, filterOutNonVueAndZeroStars } from '~/integrations/github/utilities';
import { apiReadParser, latLngParser } from '~/utilities/parsers';
import { playDing } from '~/utilities/media';
import { WebSocketBridge } from 'django-channels';

export const state = () => ({
  list: [],
  current: null,
  currentPersonRepositories: [],
  currentPersonContributed: [],
  selectedTags: [],
  peopleWebSocketBridge: null
});

export const getters = {
  getList: (state, getters, rootState, rootGetters) => {
    const user = rootGetters['user/getUserProfile'];
    return [
      ...state.list.filter(p => !user || !user.id || p.id !== user.id)
        .map(p => {
          const latlng = latLngParser(p);
          const type = p.type ? p.type : 1;
          return {
            ...p,
            selected: getters.getCurrentPerson === p.id,
            latlng,
            type,
            location: undefined
          };
        }
        )
    ];
  },
  getLatestUser: (state, getters) => {
    const last = getters.getList
      .filter(u => u.name)
      .sort((a, b) => a.id - b.id)
      .slice(-1)[0];
    if (last) {
      return last.id;
    }
    return null;
  },
  getCurrentPerson: state => {
    return state.current;
  },
  getPersonDetails: (state, getters, rootState, rootGetters) => id => {
    const loggedIn = rootGetters['user/getUserProfile'];
    if (loggedIn && id === loggedIn.id) {
      return {...loggedIn};
    }
    return {...getters.getList.find(p => p.id === id)};
  },
  getCurrentPersonDetails: (state, getters, rootState, rootGetters) => {
    const current = getters.getCurrentPerson;
    return getters.getPersonDetails(current);
  },
  getCurrentPersonRepositories: (state, getters) => {
    return [...state.currentPersonRepositories].sort((a, b) =>
      b.node.stargazers.totalCount - a.node.stargazers.totalCount
    );
  },
  getCurrentPersonContributed: (state, getters) => {
    return [...state.currentPersonContributed].sort((a, b) =>
      b.node.stargazers.totalCount - a.node.stargazers.totalCount
    );
  },
  getSelectedTags: state => {
    return [...state.selectedTags];
  }
};

export const actions = {
  async loadPeople ({commit}) {
    const { data } = await this.$axios.get('http://localhost:8000/api/people/');
    const parsed = data.map(d => apiReadParser(d));
    commit('SET_PEOPLE_LIST', parsed);
  },
  setCurrent ({commit}, id) {
    commit('SET_CURRENT', id);
    commit('SET_CURRENT_PERSON_REPOSITORY_LIST', []);
    commit('SET_CURRENT_PERSON_CONTRIBUTED_LIST', []);
  },
  async loadRepositories ({commit, getters, rootGetters}) {
    const user = getters.getCurrentPersonDetails;
    const userToken = rootGetters['user/getGithubToken'];
    const query = gitHubUserRepositories(user.github_login);
    const gh = gitHubGraphQlRequest(userToken || process.env.gitHubApiKey);
    try {
      const { data } = await this.$axios.post(gh.url, query, gh.options);
      if (data && data.data && data.data.user) {
        const repositories = data.data.user.repositories.edges;
        const contributed = data.data.user.repositoriesContributedTo.edges;
        commit('SET_CURRENT_PERSON_REPOSITORY_LIST', filterOutNonVueAndZeroStars(repositories));
        commit('SET_CURRENT_PERSON_CONTRIBUTED_LIST', filterOutNonVueAndZeroStars(contributed));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  },
  setSelectedTags ({commit}, value) {
    commit('SET_SELECTED_TAGS', value);
  },
  openSocket ({ dispatch, commit }) {
    const webSocketBridge = new WebSocketBridge();
    webSocketBridge.connect(`${process.env.webSocketProtocol}://${window.location.hostname}/ws-people`);
    webSocketBridge.listen(a => dispatch('socketAction', a));
    commit('SET_PEOPLE_WEBSOCKET_BRIDGE', webSocketBridge);
  },
  socketAction ({commit, rootGetters, state}, action) {
    if (action && action.person) {
      const person = apiReadParser(action.person);
      const index = state.list.findIndex(p => p.id === action.person.id);
      const settings = rootGetters['user/getSettings'];
      if (index !== -1) {
        const stored = {...state.list[index]};
        commit('UPDATE_PERSON', {index, person});
        if (settings.ding && person.name && !stored.name) {
          playDing(settings.ding, person);
        }
      } else {
        commit('ADD_PERSON', person);
        if (settings.ding && person.name) {
          playDing();
        }
      }
    }
  },
  closeSocket ({commit, state}) {
    state.peopleWebSocketBridge.socket.close(1000, '', { keepClosed: true });
    commit('SET_PEOPLE_WEBSOCKET_BRIDGE', null);
  },
  deletePerson ({commit}, index) {
    commit('DELETE_PERSON', index);
  }
};

export const mutations = {
  SET_PEOPLE_LIST: (state, people) => {
    state.list = people;
  },
  ADD_PERSON: (state, person) => {
    state.list.push(person);
  },
  UPDATE_PERSON: (state, {person, index}) => {
    state.list.splice(index, 1, person);
  },
  DELETE_PERSON: (state, index) => {
    state.list.splice(index, 1);
  },
  SET_CURRENT: (state, id) => {
    state.current = id;
  },
  SET_CURRENT_PERSON_REPOSITORY_LIST: (state, repositories) => {
    state.currentPersonRepositories = repositories;
  },
  SET_CURRENT_PERSON_CONTRIBUTED_LIST: (state, repositories) => {
    state.currentPersonContributed = repositories;
  },
  SET_SELECTED_TAGS: (state, tags) => {
    state.selectedTags = [...tags];
  },
  SET_PEOPLE_WEBSOCKET_BRIDGE: (state, ws) => {
    state.peopleWebSocketBridge = ws;
  }
};
